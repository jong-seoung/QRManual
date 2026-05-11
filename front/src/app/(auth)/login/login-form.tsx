"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";

interface FormValues {
  loginId: string; // email or username
  password: string;
}

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const params = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      const isEmail = values.loginId.includes("@");
      const { user } = await authApi.login({
        ...(isEmail ? { email: values.loginId } : { username: values.loginId }),
        password: values.password,
      });
      setUser(user);
      const redirect = params.get("redirect") ?? "/";
      router.push(redirect);
      router.refresh();
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 401) {
        setSubmitError(
          err.message?.includes("not activated") ? t("errors.userNotActivated") : t("errors.invalidCredentials"),
        );
      } else {
        setSubmitError(t("errors.unknown"));
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("login")}</h1>

      <Field label={`${t("email")} / ${t("username")}`} htmlFor="loginId" error={errors.loginId?.message}>
        <Input
          id="loginId"
          autoComplete="username"
          {...register("loginId", { required: true })}
        />
      </Field>

      <Field label={t("password")} htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password", { required: true })}
        />
      </Field>

      {submitError ? <p className="text-sm text-(--color-error)">{submitError}</p> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {t("login")}
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <a
          href="/api/auth/oauth2/google"
          className="inline-flex h-11 items-center justify-center rounded-(--radius) border text-sm hover:bg-(--color-muted)"
        >
          {t("loginWith", { provider: "Google" })}
        </a>
        <a
          href="/api/auth/oauth2/github"
          className="inline-flex h-11 items-center justify-center rounded-(--radius) border text-sm hover:bg-(--color-muted)"
        >
          {t("loginWith", { provider: "GitHub" })}
        </a>
      </div>

      <div className="flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-(--color-muted-foreground) hover:underline">
          {t("forgotPassword")}
        </Link>
        <Link href="/signup" className="text-(--color-muted-foreground) hover:underline">
          {t("signup")}
        </Link>
      </div>
    </form>
  );
}
