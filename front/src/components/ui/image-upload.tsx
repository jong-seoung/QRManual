"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ApiError } from "@/lib/api/client";
import { type UploadDir, uploadsApi } from "@/lib/api/uploads";

// 파일 선택 → 즉시 업로드 → URL 반영.
// URL 직접 입력도 가능. 미리보기 포함.
//
// layout:
// - "row" (기본): 미리보기 왼쪽, 입력 오른쪽. 가로 폭이 넉넉할 때.
// - "stacked": 미리보기 위, 입력 아래. 좁은 컬럼에서.
interface Props {
  value: string;
  onChange: (url: string) => void;
  dir?: UploadDir;
  id?: string;
  size?: number;
  layout?: "row" | "stacked";
}

export function ImageUpload({
  value,
  onChange,
  dir = "manual-images",
  id,
  size = 96,
  layout = "row",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const res = await uploadsApi.uploadImage(file, dir);
      onChange(res.url);
    } catch (err) {
      setError((err as ApiError).message ?? "업로드 실패");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const wrapperClass = layout === "stacked" ? "space-y-2" : "flex items-start gap-3";
  const inputsClass = layout === "stacked" ? "space-y-2" : "flex-1 space-y-2";

  return (
    <div className={wrapperClass}>
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded border bg-(--color-muted) text-xs text-(--color-muted-foreground)"
        style={{ width: size, height: size }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="preview" className="h-full w-full object-cover" />
        ) : (
          <span>이미지 없음</span>
        )}
      </div>

      <div className={inputsClass}>
        <input
          id={id}
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={onPick}
          className="block w-full text-sm"
        />
        <input
          type="url"
          placeholder="또는 이미지 URL 직접 입력"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-[8px] border border-(--color-hairline) bg-(--color-background) px-3 py-2 text-sm text-(--color-ink) outline-none placeholder:text-(--color-ink-muted-48) focus-visible:border-(--color-ink)"
        />
        <div className="flex items-center gap-2 text-xs">
          {uploading ? <span className="text-(--color-muted-foreground)">업로드 중…</span> : null}
          {value ? (
            <Button type="button" variant="ghost" onClick={() => onChange("")}>
              제거
            </Button>
          ) : null}
        </div>
        {error ? <p className="text-xs text-(--color-error)">{error}</p> : null}
      </div>
    </div>
  );
}
