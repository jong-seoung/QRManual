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

interface FormValues {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  fullName?: string;
}

export function PersonalSignupForm() {
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
      await authApi.register({
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        // companyName 생략 → 백엔드가 personal 모드로 처리
      });
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (e) {
      setSubmitError((e as ApiError).message ?? t("errors.unknown"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">일반 사용자 가입</h1>
        <p className="mt-1 text-sm text-(--color-muted-foreground)">
          매뉴얼 조회·저장용 계정입니다.{" "}
          <Link href="/signup" className="hover:underline">
            가입 유형 다시 선택
          </Link>
        </p>
      </div>

      <Field label={t("username")} htmlFor="username" error={errors.username?.message}>
        <Input
          id="username"
          autoComplete="username"
          {...register("username", { required: true, minLength: 3, maxLength: 64 })}
        />
      </Field>

      <Field label={t("email")} htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email", { required: true })}
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
        {t("signup")}
      </Button>

      <p className="text-center text-sm text-(--color-muted-foreground)">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/login" className="font-medium hover:underline">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
