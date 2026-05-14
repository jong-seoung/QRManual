import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { bookmarksApi } from "@/lib/api/bookmarks";
import type { ApiError } from "@/lib/api/client";
import type { BookmarkedManualPdf } from "@/lib/api/bookmarks";
import { getCookieHeader, getCurrentUser } from "@/lib/auth/server";

export async function generateMetadata() {
  const t = await getTranslations("myBookmarks");
  return { title: t("metaTitle") };
}

export default async function MyBookmarksPage() {
  const t = await getTranslations("myBookmarks");
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/me/bookmarks");

  const cookieHeader = await getCookieHeader();

  let items: BookmarkedManualPdf[];
  try {
    items = await bookmarksApi.listMine(cookieHeader);
  } catch (e) {
    if ((e as ApiError).status === 401) redirect("/login?redirect=/me/bookmarks");
    throw e;
  }

  return (
    <main>
      <section className="py-12 lg:py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-(--color-foreground) lg:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-sm text-(--color-muted-foreground)">
          {t("count", { count: items.length })}
        </p>
      </section>

      <section className="border-t border-(--color-divider-soft) bg-(--color-canvas-parchment) py-12 lg:py-16">
        {items.length === 0 ? (
          <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-background) px-6 py-20 text-center">
            <p className="text-lg font-semibold text-(--color-foreground)">{t("empty.title")}</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-(--color-muted-foreground)">
              {t("empty.hint")}
            </p>
            <div className="mt-8">
              <Link
                href="/manuals"
                className="rounded-(--radius) bg-(--color-primary) px-5 py-2.5 text-sm font-medium text-(--color-primary-foreground) hover:opacity-90"
              >
                {t("empty.browse")}
              </Link>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {items.map(({ pdf, manual, company }) => (
              <li
                key={pdf.id}
                className="rounded-(--radius-card) border border-(--color-border) bg-(--color-background) p-5 transition hover:border-(--color-primary)"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-(--radius-utility) bg-(--color-canvas-parchment) text-xs font-semibold uppercase text-(--color-primary)">
                    {pdf.language}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-base font-semibold text-(--color-foreground)">
                      {pdf.title ?? pdf.originFileName ?? manual.name}
                    </div>
                    <Link
                      href={`/p/${manual.id}`}
                      className="mt-1 inline-block truncate text-xs text-(--color-muted-foreground) hover:text-(--color-primary)"
                    >
                      {company.name} · {manual.name}
                    </Link>
                  </div>
                  <a
                    href={pdf.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-(--radius) bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) hover:opacity-90"
                  >
                    {t("open")} →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
