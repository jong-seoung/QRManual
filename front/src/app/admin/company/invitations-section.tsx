"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ApiError } from "@/lib/api/client";
import { companyApi, type Invitation } from "@/lib/api/company";

interface FormValues {
  email: string;
  role: "ADMIN" | "USER";
}

export function InvitationsSection() {
  const [list, setList] = useState<Invitation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: { role: "USER" },
  });

  function refresh() {
    void companyApi.listInvitations().then(setList);
  }

  useEffect(refresh, []);

  async function onSubmit(values: FormValues) {
    setError(null);
    setInfo(null);
    try {
      await companyApi.createInvitation(values.email, values.role);
      setInfo(`${values.email} 으로 초대 발송됨`);
      reset({ email: "", role: "USER" });
      refresh();
    } catch (e) {
      setError((e as ApiError).message ?? "초대 발송 실패");
    }
  }

  async function cancel(id: number) {
    if (!confirm("이 초대를 취소할까요?")) return;
    try {
      await companyApi.cancelInvitation(id);
      refresh();
    } catch (e) {
      setError((e as ApiError).message ?? "취소 실패");
    }
  }

  return (
    <section className="rounded-md border p-4">
      <h2 className="text-xl font-semibold">초대 보내기</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Field label="이메일" htmlFor="invite-email">
            <Input id="invite-email" type="email" {...register("email", { required: true })} />
          </Field>
        </div>
        <div>
          <Field label="역할" htmlFor="invite-role">
            <select
              id="invite-role"
              className="h-11 rounded-(--radius) border bg-(--color-background) px-3"
              {...register("role")}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </Field>
        </div>
        <Button type="submit" disabled={formState.isSubmitting}>
          발송
        </Button>
      </form>

      {info ? <p className="mt-2 text-sm text-(--color-muted-foreground)">{info}</p> : null}
      {error ? <p className="mt-2 text-sm text-(--color-error)">{error}</p> : null}

      <h3 className="mt-6 text-base font-semibold">대기 초대 ({list.length})</h3>
      <ul className="mt-2 divide-y">
        {list.map((inv) => (
          <li key={inv.id} className="flex items-center gap-3 py-2 text-sm">
            <div className="flex-1">
              <div className="font-medium">{inv.email}</div>
              <div className="text-(--color-muted-foreground)">
                {inv.role} · 만료 {new Date(inv.expiresAt).toLocaleString()}
              </div>
            </div>
            <Button variant="ghost" onClick={() => cancel(inv.id)}>
              취소
            </Button>
          </li>
        ))}
        {list.length === 0 ? (
          <li className="py-2 text-sm text-(--color-muted-foreground)">대기 중인 초대 없음</li>
        ) : null}
      </ul>
    </section>
  );
}
