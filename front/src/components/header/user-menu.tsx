"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { authApi } from "@/lib/api/auth";
import type { AuthUser } from "@/lib/auth/types";

import { ProfileModal } from "./profile-modal";

export function UserMenu({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  async function logout() {
    setOpen(false);
    try {
      await authApi.logout();
    } catch {
      // 무시 — 사용자는 이미 로그아웃 의도
    }
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-(--color-muted)"
        >
          <span>{user.username}</span>
          {user.companyRole ? (
            <span className="text-xs text-(--color-muted-foreground)">· {user.companyRole}</span>
          ) : null}
          <span aria-hidden className="ml-0.5 text-xs">
            ▾
          </span>
        </button>

        {open ? (
          <div
            role="menu"
            className="absolute right-0 mt-1 w-44 overflow-hidden rounded-(--radius) border bg-(--color-background) shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                setShowModal(true);
              }}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-(--color-muted)"
            >
              회원정보 변경
            </button>
            <hr className="border-(--color-border)" />
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className="block w-full px-4 py-2 text-left text-sm text-(--color-error) hover:bg-(--color-muted)"
            >
              로그아웃
            </button>
          </div>
        ) : null}
      </div>

      {showModal ? <ProfileModal user={user} onClose={() => setShowModal(false)} /> : null}
    </>
  );
}
