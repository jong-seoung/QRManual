"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ApiError } from "@/lib/api/client";
import { type ManualPdf, manualPdfsApi } from "@/lib/api/manual-pdfs";

interface UploadValues {
  language: string;
  title?: string;
  files: FileList;
}

export function PdfsSection({ manualId }: { manualId: number }) {
  const [list, setList] = useState<ManualPdf[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadValues>({ defaultValues: { language: "ko" } });

  function refresh() {
    void manualPdfsApi.listByManual(manualId).then(setList);
  }

  useEffect(refresh, [manualId]);

  async function onUpload(values: UploadValues) {
    setError(null);
    const file = values.files?.[0];
    if (!file) {
      setError("파일을 선택해주세요");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("PDF 파일만 업로드할 수 있습니다");
      return;
    }
    setUploading(true);
    try {
      await manualPdfsApi.upload(manualId, file, values.language, values.title);
      reset({ language: values.language, title: "" });
      refresh();
    } catch (e) {
      setError((e as ApiError).message ?? "업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("이 PDF를 삭제할까요?")) return;
    setBusy(id);
    try {
      await manualPdfsApi.remove(id);
      refresh();
    } catch (e) {
      setError((e as ApiError).message ?? "삭제 실패");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="space-y-4 rounded-md border p-4">
      <h2 className="text-xl font-semibold">매뉴얼 PDF ({list.length})</h2>

      <form onSubmit={handleSubmit(onUpload)} className="grid gap-3 rounded border bg-(--color-muted) p-3 sm:grid-cols-[120px_1fr_auto]">
        <Field label="언어" htmlFor="language" error={errors.language?.message}>
          <Input
            id="language"
            placeholder="ko"
            {...register("language", { required: true, minLength: 2, maxLength: 16 })}
          />
        </Field>
        <Field label="제목 (선택)" htmlFor="title">
          <Input id="title" placeholder="사용자 매뉴얼" {...register("title")} />
        </Field>
        <div className="flex flex-col justify-end gap-2">
          <input
            type="file"
            accept="application/pdf"
            {...register("files", { required: true })}
            className="text-sm"
          />
          <Button type="submit" disabled={uploading}>
            {uploading ? "업로드 중…" : "업로드"}
          </Button>
        </div>
      </form>

      {error ? <p className="text-sm text-(--color-error)">{error}</p> : null}

      {list.length === 0 ? (
        <p className="text-sm text-(--color-muted-foreground)">등록된 PDF 없음</p>
      ) : (
        <ul className="divide-y">
          {list.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
              <span className="rounded-md bg-(--color-muted) px-2 py-0.5 text-xs uppercase">
                {p.language}
              </span>
              <div className="flex-1">
                <div className="font-medium">
                  {p.title ?? p.originFileName ?? "(제목 없음)"}
                </div>
                <div className="text-xs text-(--color-muted-foreground)">
                  {p.originFileName}
                  {p.fileSize ? ` · ${formatSize(p.fileSize)}` : null}
                </div>
              </div>
              <a
                href={p.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-(--color-primary) hover:underline"
              >
                열기
              </a>
              <Button variant="ghost" disabled={busy === p.id} onClick={() => remove(p.id)}>
                삭제
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
