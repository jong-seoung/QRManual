// 이미지 단발 업로드 — 매뉴얼 생성 화면처럼 ID가 아직 없을 때 사용.
// PDF는 manual-pdfs.ts의 upload()를 그대로 쓰면 됨 (manualId 필요).

export type UploadDir = "manual-images" | "part-images";

export interface UploadedImage {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

export const uploadsApi = {
  async uploadImage(file: File, dir: UploadDir = "manual-images"): Promise<UploadedImage> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
    const fd = new FormData();
    fd.append("file", file);
    fd.append("dir", dir);

    const res = await fetch(`${baseUrl}/uploads/images`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    if (!res.ok) {
      let payload: { error?: { code?: string; message?: string } } = {};
      try {
        payload = (await res.json()) as typeof payload;
      } catch {
        // 무시
      }
      throw {
        status: res.status,
        code: payload.error?.code ?? "UNKNOWN",
        message: payload.error?.message ?? `HTTP ${res.status}`,
      };
    }
    return (await res.json()) as UploadedImage;
  },
};
