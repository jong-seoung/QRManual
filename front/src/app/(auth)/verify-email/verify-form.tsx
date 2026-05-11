"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/client";

interface FormValues {
  email: string;
  code: string;
}

export function VerifyEmailForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const params = useSearchParams();
  const initialEmail = params.get("email") ?? "";
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ defaultValues: { email: initialEmail, code: "" } });

  // 페이지 진입 즉시 이메일 코드 발송 (한 번만)
  useEffect(() => {
    if (!initialEmail) return;
    setSending(true);
    authApi
      .sendVerificationEmail(initialEmail)
      .then(() => setInfo(`인증 코드를 ${initialEmail} 으로 발송했습니다.`))
      .catch(() => setInfo(null))
      .finally(() => setSending(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function resend() {
    const email = getValues("email");
    if (!email) return;
    setSending(true);
    setSubmitError(null);
    try {
      await authApi.sendVerificationEmail(email);
      setInfo(`인증 코드를 ${email} 으로 다시 발송했습니다.`);
    } catch (e) {
      setSubmitError((e as ApiError).message ?? t("errors.unknown"));
    } finally {
      setSending(false);
    }
  }

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      await authApi.verifyEmail(values.email, values.code);
      router.push(`/login?verified=1`);
    } catch (e) {
      setSubmitError((e as ApiError).message ?? t("errors.wrongCode"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("emailVerification")}</h1>

      <Field label={t("email")} htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email", {
            required: true,
            onChange: (e) => setValue("email", (e.target as HTMLInputElement).value),
          })}
        />
      </Field>

      <Field label={t("verificationCode")} htmlFor="code" error={errors.code?.message}>
        <Input id="code" inputMode="numeric" {...register("code", { required: true, minLength: 4 })} />
      </Field>

      {info ? <p className="text-sm text-(--color-muted-foreground)">{info}</p> : null}
      {submitError ? <p className="text-sm text-(--color-error)">{submitError}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {t("verify")}
        </Button>
        <Button type="button" variant="secondary" onClick={resend} disabled={sending}>
          {t("resendCode")}
        </Button>
      </div>

      <p className="text-center text-sm text-(--color-muted-foreground)">
        <Link href="/login" className="hover:underline">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
