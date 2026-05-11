"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import type { ApiError } from "@/lib/api/client";
import { type Part, partsApi } from "@/lib/api/manual-extras";

interface FormValues {
  name: string;
  imageUrl?: string;
  storeLink?: string;
}

export function PartsSection({ manualId }: { manualId: number }) {
  const [list, setList] = useState<Part[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState } = useForm<FormValues>();

  function refresh() {
    void partsApi.list(manualId).then(setList);
  }

  useEffect(refresh, [manualId]);

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      await partsApi.create(manualId, {
        name: values.name,
        imageUrl: values.imageUrl || undefined,
        storeLink: values.storeLink || undefined,
      });
      reset({ name: "", imageUrl: "", storeLink: "" });
      refresh();
    } catch (e) {
      setError((e as ApiError).message ?? "추가 실패");
    }
  }

  async function remove(id: number) {
    if (!confirm("이 부품을 삭제할까요?")) return;
    setBusy(id);
    try {
      await partsApi.remove(id);
      refresh();
    } catch (e) {
      setError((e as ApiError).message ?? "삭제 실패");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="space-y-4 rounded-md border p-4">
      <h2 className="text-xl font-semibold">부품 ({list.length})</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 rounded border bg-(--color-muted) p-3 sm:grid-cols-3">
        <Field label="이름" htmlFor="part-name">
          <Input id="part-name" {...register("name", { required: true })} />
        </Field>
        <Field label="이미지 (선택)" htmlFor="part-image">
          <ImageUpload
            id="part-image"
            value={watch("imageUrl") ?? ""}
            onChange={(url) => setValue("imageUrl", url, { shouldDirty: true })}
            dir="part-images"
            size={80}
          />
        </Field>
        <Field label="구매 링크 (선택)" htmlFor="part-store">
          <Input id="part-store" type="url" {...register("storeLink")} />
        </Field>
        <div className="sm:col-span-3">
          <Button type="submit" disabled={formState.isSubmitting}>
            추가
          </Button>
        </div>
      </form>

      {error ? <p className="text-sm text-(--color-error)">{error}</p> : null}

      {list.length === 0 ? (
        <p className="text-sm text-(--color-muted-foreground)">등록된 부품 없음</p>
      ) : (
        <ul className="divide-y">
          {list.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name} className="h-12 w-12 rounded object-cover" />
              ) : null}
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                {p.storeLink ? (
                  <a
                    href={p.storeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-(--color-primary) hover:underline"
                  >
                    구매 링크 →
                  </a>
                ) : null}
              </div>
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
