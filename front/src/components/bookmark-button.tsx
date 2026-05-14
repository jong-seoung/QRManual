"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { bookmarksApi } from "@/lib/api/bookmarks";
import type { ApiError } from "@/lib/api/client";

// PDF 단위 저장 버튼.
// 비로그인: 로그인 유도 링크
// 로그인: 토글 버튼 + 자기 상태 fetch
export function BookmarkButton({
  manualPdfId,
  redirect,
  size = "md",
}: {
  manualPdfId: number;
  redirect?: string;
  size?: "sm" | "md";
}) {
  const t = useTranslations("bookmark");
  const [bookmarked, setBookmarked] = useState<boolean | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    bookmarksApi
      .isMine(manualPdfId)
      .then((res) => {
        if (cancelled) return;
        setBookmarked(res.bookmarked);
        setAuthed(true);
      })
      .catch((e: ApiError) => {
        if (cancelled) return;
        if (e.status === 401 || e.status === 403) setAuthed(false);
        else setError(e.message ?? "");
      });
    return () => {
      cancelled = true;
    };
  }, [manualPdfId]);

  async function toggle() {
    if (!authed || busy) return;
    setBusy(true);
    setError(null);
    const next = !bookmarked;
    setBookmarked(next);
    try {
      if (next) await bookmarksApi.add(manualPdfId);
      else await bookmarksApi.remove(manualPdfId);
    } catch (e) {
      setBookmarked(!next);
      setError((e as ApiError).message ?? "");
    } finally {
      setBusy(false);
    }
  }

  const cls = size === "sm" ? "h-8 px-2 text-xs" : "h-9 px-3 text-sm";

  if (authed === false) {
    return (
      <Link
        href={`/login?redirect=${encodeURIComponent(redirect ?? "/")}`}
        className={`inline-flex items-center rounded-(--radius) border hover:bg-(--color-muted) ${cls}`}
      >
        ☆ {t("loginToSave")}
      </Link>
    );
  }

  if (bookmarked === null) {
    return (
      <span
        className={`inline-flex items-center rounded-(--radius) border text-(--color-muted-foreground) ${cls}`}
      >
        …
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      title={error ?? undefined}
      aria-pressed={bookmarked}
      className={`inline-flex items-center gap-1 rounded-(--radius) border font-medium transition disabled:opacity-50 ${cls} ${
        bookmarked
          ? "border-(--color-primary) bg-(--color-primary) text-(--color-primary-foreground)"
          : "hover:bg-(--color-muted)"
      }`}
    >
      <span aria-hidden>{bookmarked ? "★" : "☆"}</span>
      <span>{bookmarked ? t("saved") : t("save")}</span>
    </button>
  );
}
