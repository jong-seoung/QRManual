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
  address?: string;
  companyName: string;
  homePage?: string;
  officialMark?: boolean;
}

export function CompanySignupForm() {
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
        address: values.address,
        companyName: values.companyName,
        homePage: values.homePage || undefined,
        officialMark: values.officialMark ?? false,
      });
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (e) {
      const err = e as ApiError;
      setSubmitError(err.message ?? t("errors.unknown"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">회사 가입</h1>
        <p className="mt-1 text-sm text-(--color-muted-foreground)">
          새 회사를 만들고 OWNER로 가입.{" "}
          <Link href="/signup" className="hover:underline">
            가입 유형 다시 선택
          </Link>
        </p>
      </div>

      <fieldset className="space-y-4 border-t pt-4">
        <legend className="text-sm font-medium text-(--color-muted-foreground)">계정</legend>

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

        <Field label={t("address")} htmlFor="address" error={errors.address?.message}>
          <Input id="address" autoComplete="street-address" {...register("address")} />
        </Field>
      </fieldset>

      <fieldset className="space-y-4 border-t pt-4">
        <legend className="text-sm font-medium text-(--color-muted-foreground)">회사</legend>

        <Field label="회사명" htmlFor="companyName" error={errors.companyName?.message}>
          <Input
            id="companyName"
            {...register("companyName", { required: true, minLength: 1, maxLength: 128 })}
          />
        </Field>

        <Field label="홈페이지 (선택)" htmlFor="homePage" error={errors.homePage?.message}>
          <Input id="homePage" type="url" placeholder="https://example.com" {...register("homePage")} />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("officialMark")} />
          <span>공식 인증 마크 (선택)</span>
        </label>
      </fieldset>

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
