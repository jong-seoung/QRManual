import { apiFetch } from "./client";

export interface ManualPdf {
  id: number;
  manualId: number;
  language: string;
  title: string | null;
  pdfUrl: string;
  originFileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
}

export const manualPdfsApi = {
  listByManual(manualId: number, cookieHeader?: string) {
    return apiFetch<ManualPdf[]>(`/manuals/${manualId}/pdfs`, { method: "GET", cookieHeader });
  },

  // multipart/form-data 업로드 — apiFetch는 JSON 전용이라 fetch 직접 사용
  async upload(manualId: number, file: File, language: string, title?: string): Promise<ManualPdf> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
    const fd = new FormData();
    fd.append("file", file);
    fd.append("language", language);
    if (title) fd.append("title", title);

    const res = await fetch(`${baseUrl}/manuals/${manualId}/pdfs`, {
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
    return (await res.json()) as ManualPdf;
  },

  update(id: number, patch: { language?: string; title?: string }) {
    return apiFetch<ManualPdf>(`/manual-pdfs/${id}`, { method: "PATCH", body: patch });
  },

  remove(id: number) {
    return apiFetch<void>(`/manual-pdfs/${id}`, { method: "DELETE" });
  },
};
