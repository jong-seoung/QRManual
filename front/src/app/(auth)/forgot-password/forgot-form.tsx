"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/client";

// 옛 흐름:
// 1) 이메일 입력 → 인증코드 발송
// 2) 코드 입력 → /findPw 호출 → 비번 재설정 코드 발급
// 3) 새 비번 + 발급된 코드 → /changePw

type Step = "request" | "verify" | "reset";

interface FormValues {
  email: string;
  emailCode: string;
  resetCode: string;
  password: string;
  password2: string;
}

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>();

  const password = watch("password");

  async function sendEmail() {
    setSubmitError(null);
    const email = getValues("email");
    if (!email) {
      setSubmitError(t("errors.unknown"));
      return;
    }
    try {
      await authApi.sendVerificationEmail(email);
      setInfo(`인증 코드를 ${email} 으로 발송했습니다.`);
      setStep("verify");
    } catch (e) {
      setSubmitError((e as ApiError).message ?? t("errors.unknown"));
    }
  }

  async function verifyCode() {
    setSubmitError(null);
    const { email, emailCode } = getValues();
    try {
      const resetCode = await authApi.issuePasswordResetCode(email, emailCode);
      setValue("resetCode", resetCode);
      setInfo("인증 완료. 새 비밀번호를 입력해 주세요.");
      setStep("reset");
    } catch (e) {
      setSubmitError((e as ApiError).message ?? t("errors.wrongCode"));
    }
  }

  async function onResetSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      await authApi.changePassword({
        email: values.email,
        authCode: values.resetCode,
        password: values.password,
        password2: values.password2,
      });
      router.push("/login?reset=1");
    } catch (e) {
      setSubmitError((e as ApiError).message ?? t("errors.unknown"));
    }
  }

  return (
    <form
      onSubmit={
        step === "reset" ? handleSubmit(onResetSubmit) : (e) => e.preventDefault()
      }
      className="space-y-4"
    >
      <h1 className="text-2xl font-semibold">{t("forgotPassword")}</h1>

      <Field label={t("email")} htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          disabled={step !== "request"}
          {...register("email", { required: true })}
        />
      </Field>

      {step === "request" ? (
        <Button type="button" className="w-full" onClick={sendEmail}>
          {t("sendCode")}
        </Button>
      ) : null}

      {step === "verify" ? (
        <>
          <Field label={t("verificationCode")} htmlFor="emailCode" error={errors.emailCode?.message}>
            <Input id="emailCode" {...register("emailCode", { required: true })} />
          </Field>
          <Button type="button" className="w-full" onClick={verifyCode}>
            {t("verify")}
          </Button>
        </>
      ) : null}

      {step === "reset" ? (
        <>
          <Field label={t("newPassword")} htmlFor="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password", { required: true, minLength: 8 })}
            />
          </Field>
          <Field label={t("passwordConfirm")} htmlFor="password2" error={errors.password2?.message}>
            <Input
              id="password2"
              type="password"
              autoComplete="new-password"
              {...register("password2", {
                required: true,
                validate: (v) => v === password || t("errors.passwordMismatch"),
              })}
            />
          </Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {t("resetPassword")}
          </Button>
        </>
      ) : null}

      {info ? <p className="text-sm text-(--color-muted-foreground)">{info}</p> : null}
      {submitError ? <p className="text-sm text-(--color-error)">{submitError}</p> : null}

      <p className="text-center text-sm text-(--color-muted-foreground)">
        <Link href="/login" className="hover:underline">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
