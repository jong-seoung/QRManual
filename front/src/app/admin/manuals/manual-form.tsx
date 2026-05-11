"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import type { ApiError } from "@/lib/api/client";
import { type Manual, manualsApi } from "@/lib/api/manuals";

interface FormValues {
  name: string;
  imageUrl?: string;
  modelCode?: string;
  releaseYear?: string;
  serialNumberLocation?: string;
  productPage?: string;
  publicStoreLink?: string;
}

interface Props {
  mode: "create" | "edit";
  manual?: Manual;
}

export function ManualForm({ mode, manual }: Props) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    defaultValues: manual
      ? {
          name: manual.name,
          imageUrl: manual.imageUrl ?? "",
          modelCode: manual.modelCode ?? "",
          releaseYear: manual.releaseYear ? String(manual.releaseYear) : "",
          serialNumberLocation: manual.serialNumberLocation ?? "",
          productPage: manual.productPage ?? "",
          publicStoreLink: manual.publicStoreLink ?? "",
        }
      : {},
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const payload = {
      name: values.name,
      imageUrl: values.imageUrl || undefined,
      modelCode: values.modelCode || undefined,
      releaseYear: values.releaseYear ? Number(values.releaseYear) : undefined,
      serialNumberLocation: values.serialNumberLocation || undefined,
      productPage: values.productPage || undefined,
      publicStoreLink: values.publicStoreLink || undefined,
    };
    try {
      if (mode === "create") {
        const created = await manualsApi.create(payload);
        router.push(`/admin/manuals/${created.id}`);
      } else if (manual) {
        await manualsApi.update(manual.id, payload);
        router.refresh();
      }
    } catch (e) {
      setSubmitError((e as ApiError).message ?? "저장 실패");
    }
  }

  async function handleDelete() {
    if (!manual) return;
    if (!confirm("이 매뉴얼을 삭제할까요? (소프트 삭제)")) return;
    try {
      await manualsApi.remove(manual.id);
      router.push("/admin/manuals");
    } catch (e) {
      setSubmitError((e as ApiError).message ?? "삭제 실패");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border p-4">
      <Field label="매뉴얼 이름" htmlFor="name" error={errors.name?.message}>
        <Input id="name" {...register("name", { required: true, minLength: 1, maxLength: 255 })} />
      </Field>

      <Field label="대표 이미지" htmlFor="imageUrl">
        <ImageUpload
          id="imageUrl"
          value={watch("imageUrl") ?? ""}
          onChange={(url) => setValue("imageUrl", url, { shouldDirty: true })}
          dir="manual-images"
          size={120}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="모델 코드" htmlFor="modelCode">
          <Input id="modelCode" {...register("modelCode")} />
        </Field>
        <Field label="출시 연도" htmlFor="releaseYear">
          <Input
            id="releaseYear"
            type="number"
            min={1900}
            max={2100}
            {...register("releaseYear")}
          />
        </Field>
      </div>

      <Field label="시리얼 번호 위치" htmlFor="serialNumberLocation">
        <Input
          id="serialNumberLocation"
          placeholder="예: 본체 하단"
          {...register("serialNumberLocation")}
        />
      </Field>

      <Field label="제품 페이지 URL" htmlFor="productPage">
        <Input id="productPage" type="url" {...register("productPage")} />
      </Field>

      <Field label="공식 스토어 링크" htmlFor="publicStoreLink">
        <Input id="publicStoreLink" type="url" {...register("publicStoreLink")} />
      </Field>

      {submitError ? <p className="text-sm text-(--color-error)">{submitError}</p> : null}

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {mode === "create" ? "생성" : "저장"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/manuals")}>
            취소
          </Button>
        </div>
        {mode === "edit" && manual ? (
          <Button type="button" variant="ghost" onClick={handleDelete}>
            삭제
          </Button>
        ) : null}
      </div>
    </form>
  );
}
