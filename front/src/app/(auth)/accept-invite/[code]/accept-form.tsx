"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/client";
import type { InvitationPreview } from "@/lib/api/company";

interface FormValues {
  username: string;
  password: string;
  passwordConfirm: string;
  fullName?: string;
}

export function AcceptInviteForm({
  code,
  preview,
}: {
  code: string;
  preview: InvitationPreview;
}) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>();

  const password = watch("password");

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      await authApi.acceptInvite({
        code,
        username: values.username,
        password: values.password,
        fullName: values.fullName,
      });
      router.push("/login?invited=1");
    } catch (e) {
      setSubmitError((e as ApiError).message ?? t("errors.unknown"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-semibold">초대 수락</h1>
      <div className="rounded-md border bg-(--color-muted) p-3 text-sm">
        <p>
          <strong>{preview.companyName}</strong>의{" "}
          <strong>{preview.role}</strong> 역할로 초대됨
        </p>
        <p className="text-(--color-muted-foreground)">{preview.email}</p>
      </div>

      <Field label={t("username")} htmlFor="username" error={errors.username?.message}>
        <Input
          id="username"
          autoComplete="username"
          {...register("username", { required: true, minLength: 3, maxLength: 64 })}
        />
      </Field>

      <Field label={t("password")} htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password", { required: true, minLength: 8 })}
        />
      </Field>

      <Field
        label={t("passwordConfirm")}
        htmlFor="passwordConfirm"
        error={errors.passwordConfirm?.message}
      >
        <Input
          id="passwordConfirm"
          type="password"
          autoComplete="new-password"
          {...register("passwordConfirm", {
            required: true,
            validate: (v) => v === password || t("errors.passwordMismatch"),
          })}
        />
      </Field>

      <Field label={t("fullName")} htmlFor="fullName" error={errors.fullName?.message}>
        <Input id="fullName" autoComplete="name" {...register("fullName")} />
      </Field>

      {submitError ? <p className="text-sm text-(--color-error)">{submitError}</p> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        가입하기
      </Button>
    </form>
  );
}
