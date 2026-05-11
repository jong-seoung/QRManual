"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/client";
import type { AuthUser } from "@/lib/auth/types";

interface ProfileValues {
  fullName: string;
  address: string;
  profileImageUrl: string;
}

interface PasswordValues {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

interface Props {
  user: AuthUser;
  onClose: () => void;
}

type Tab = "profile" | "password";

export function ProfileModal({ user, onClose }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  // SSR 시 document 접근 방지 — 클라이언트 마운트 후 portal 렌더
  useEffect(() => setMounted(true), []);

  const profileForm = useForm<ProfileValues>({
    defaultValues: {
      fullName: user.fullName ?? "",
      address: user.address ?? "",
      profileImageUrl: user.profileImageUrl ?? "",
    },
  });

  const passwordForm = useForm<PasswordValues>();
  const newPwd = passwordForm.watch("newPassword");

  // ESC로 닫기
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function onSaveProfile(values: ProfileValues) {
    setError(null);
    setInfo(null);
    try {
      await authApi.updateMe({
        fullName: values.fullName || undefined,
        address: values.address || undefined,
        profileImageUrl: values.profileImageUrl || undefined,
      });
      setInfo("저장됨");
      router.refresh();
    } catch (e) {
      setError((e as ApiError).message ?? "저장 실패");
    }
  }

  async function onChangePassword(values: PasswordValues) {
    setError(null);
    setInfo(null);
    try {
      await authApi.changeOwnPassword(values);
      setInfo("비밀번호 변경 완료");
      passwordForm.reset();
    } catch (e) {
      setError((e as ApiError).message ?? "비밀번호 변경 실패");
    }
  }

  if (!mounted) return null;

  // backdrop-filter 가진 헤더 안에 두면 fixed가 viewport가 아닌 헤더 기준이 됨.
  // → document.body로 portal해서 stacking context 탈출.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        aria-label="회원정보 변경"
        className="w-full max-w-md overflow-hidden rounded-(--radius) border bg-(--color-background) shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">회원정보</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-(--color-muted-foreground) hover:text-(--color-foreground)"
          >
            ✕
          </button>
        </header>

        <nav className="flex border-b text-sm">
          <button
            type="button"
            onClick={() => setTab("profile")}
            className={`flex-1 px-4 py-2 ${
              tab === "profile"
                ? "border-b-2 border-(--color-primary) font-medium"
                : "text-(--color-muted-foreground) hover:text-(--color-foreground)"
            }`}
          >
            프로필
          </button>
          <button
            type="button"
            onClick={() => setTab("password")}
            className={`flex-1 px-4 py-2 ${
              tab === "password"
                ? "border-b-2 border-(--color-primary) font-medium"
                : "text-(--color-muted-foreground) hover:text-(--color-foreground)"
            }`}
          >
            비밀번호
          </button>
        </nav>

        <div className="space-y-3 p-4 text-sm">
          <dl className="space-y-1 rounded bg-(--color-muted) p-3 text-xs">
            <Row label="아이디" value={user.username} />
            <Row label="이메일" value={user.email ?? "—"} />
            <Row
              label="역할"
              value={user.systemRole ?? user.companyRole ?? "일반"}
            />
          </dl>

          {tab === "profile" ? (
            <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-3">
              <Field label="이름" htmlFor="me-fullName">
                <Input id="me-fullName" {...profileForm.register("fullName")} />
              </Field>
              <Field label="주소" htmlFor="me-address">
                <Input id="me-address" {...profileForm.register("address")} />
              </Field>
              <Field label="프로필 이미지 URL" htmlFor="me-image">
                <Input id="me-image" type="url" {...profileForm.register("profileImageUrl")} />
              </Field>

              {error ? <p className="text-(--color-error)">{error}</p> : null}
              {info ? <p className="text-(--color-muted-foreground)">{info}</p> : null}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={onClose}>
                  닫기
                </Button>
                <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                  저장
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-3">
              <Field label="현재 비밀번호" htmlFor="me-cur-pw">
                <Input
                  id="me-cur-pw"
                  type="password"
                  autoComplete="current-password"
                  {...passwordForm.register("currentPassword", { required: true })}
                />
              </Field>
              <Field label="새 비밀번호" htmlFor="me-new-pw">
                <Input
                  id="me-new-pw"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("newPassword", { required: true, minLength: 8 })}
                />
              </Field>
              <Field
                label="새 비밀번호 확인"
                htmlFor="me-new-pw2"
                error={passwordForm.formState.errors.newPasswordConfirm?.message}
              >
                <Input
                  id="me-new-pw2"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("newPasswordConfirm", {
                    required: true,
                    validate: (v) => v === newPwd || "비밀번호가 일치하지 않습니다",
                  })}
                />
              </Field>

              {error ? <p className="text-(--color-error)">{error}</p> : null}
              {info ? <p className="text-(--color-muted-foreground)">{info}</p> : null}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={onClose}>
                  닫기
                </Button>
                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                  변경
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-(--color-muted-foreground)">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
