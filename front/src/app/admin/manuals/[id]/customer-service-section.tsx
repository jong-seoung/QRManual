"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ApiError } from "@/lib/api/client";
import { type CustomerService, customerServiceApi } from "@/lib/api/manual-extras";

interface FormValues {
  phone?: string;
  email?: string;
  operationTime?: string;
  chatLink?: string;
}

export function CustomerServiceSection({ manualId }: { manualId: number }) {
  const [info, setInfo] = useState<CustomerService | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState } = useForm<FormValues>();

  function refresh() {
    void customerServiceApi.get(manualId).then((data) => {
      setInfo(data);
      reset({
        phone: data?.phone ?? "",
        email: data?.email ?? "",
        operationTime: data?.operationTime ?? "",
        chatLink: data?.chatLink ?? "",
      });
      setLoaded(true);
    });
  }

  useEffect(refresh, [manualId, reset]);

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const saved = await customerServiceApi.upsert(manualId, {
        phone: values.phone || undefined,
        email: values.email || undefined,
        operationTime: values.operationTime || undefined,
        chatLink: values.chatLink || undefined,
      });
      setInfo(saved);
    } catch (e) {
      setError((e as ApiError).message ?? "저장 실패");
    }
  }

  async function remove() {
    if (!confirm("고객센터 정보를 삭제할까요?")) return;
    try {
      await customerServiceApi.remove(manualId);
      setInfo(null);
      reset({ phone: "", email: "", operationTime: "", chatLink: "" });
    } catch (e) {
      setError((e as ApiError).message ?? "삭제 실패");
    }
  }

  if (!loaded) return <section className="rounded-md border p-4">고객센터 정보 불러오는 중…</section>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">고객센터</h2>
        {info ? (
          <Button type="button" variant="ghost" onClick={remove}>
            삭제
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="전화" htmlFor="cs-phone">
          <Input id="cs-phone" type="tel" {...register("phone")} />
        </Field>
        <Field label="이메일" htmlFor="cs-email">
          <Input id="cs-email" type="email" {...register("email")} />
        </Field>
        <Field label="운영 시간" htmlFor="cs-time">
          <Input id="cs-time" placeholder="평일 09:00–18:00" {...register("operationTime")} />
        </Field>
        <Field label="채팅 링크" htmlFor="cs-chat">
          <Input id="cs-chat" type="url" {...register("chatLink")} />
        </Field>
      </div>

      {error ? <p className="text-sm text-(--color-error)">{error}</p> : null}

      <Button type="submit" disabled={formState.isSubmitting}>
        {info ? "저장" : "등록"}
      </Button>
    </form>
  );
}
