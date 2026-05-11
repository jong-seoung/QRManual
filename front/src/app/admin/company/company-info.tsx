"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ApiError } from "@/lib/api/client";
import { type Company, companyApi } from "@/lib/api/company";

interface FormValues {
  name: string;
  homePage?: string;
  officialMark: boolean;
}

export function CompanyInfoSection({ canEdit }: { canEdit: boolean }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState } = useForm<FormValues>();

  useEffect(() => {
    void companyApi.getMine().then((c) => {
      setCompany(c);
      reset({ name: c.name, homePage: c.homePage ?? "", officialMark: c.officialMark });
    });
  }, [reset]);

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const updated = await companyApi.updateMine({
        name: values.name,
        homePage: values.homePage || undefined,
        officialMark: values.officialMark,
      });
      setCompany(updated);
      setEditing(false);
    } catch (e) {
      setError((e as ApiError).message ?? "수정 실패");
    }
  }

  if (!company) return <section>회사 정보를 불러오는 중…</section>;

  if (!editing) {
    return (
      <section className="rounded-md border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{company.name}</h2>
          {canEdit ? (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              수정
            </Button>
          ) : null}
        </div>
        <dl className="mt-3 space-y-1 text-sm">
          <div>
            <dt className="inline text-(--color-muted-foreground)">홈페이지: </dt>
            <dd className="inline">{company.homePage ?? "—"}</dd>
          </div>
          <div>
            <dt className="inline text-(--color-muted-foreground)">공식 인증: </dt>
            <dd className="inline">{company.officialMark ? "예" : "아니오"}</dd>
          </div>
        </dl>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border p-4">
      <h2 className="text-xl font-semibold">회사 정보 수정</h2>
      <Field label="회사명" htmlFor="name">
        <Input id="name" {...register("name", { required: true })} />
      </Field>
      <Field label="홈페이지" htmlFor="homePage">
        <Input id="homePage" type="url" {...register("homePage")} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("officialMark")} />
        <span>공식 인증 마크</span>
      </label>
      {error ? <p className="text-sm text-(--color-error)">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" disabled={formState.isSubmitting}>
          저장
        </Button>
        <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
          취소
        </Button>
      </div>
    </form>
  );
}
