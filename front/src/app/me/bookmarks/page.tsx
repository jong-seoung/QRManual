import Link from "next/link";
import { redirect } from "next/navigation";

import { bookmarksApi } from "@/lib/api/bookmarks";
import type { ApiError } from "@/lib/api/client";
import type { BookmarkedManualPdf } from "@/lib/api/bookmarks";
import { getCookieHeader, getCurrentUser } from "@/lib/auth/server";

export const metadata = { title: "저장한 사용설명서 — QRManual" };

export default async function MyBookmarksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/me/bookmarks");

  const cookieHeader = await getCookieHeader();

  let items: BookmarkedManualPdf[];
  try {
    items = await bookmarksApi.listMine(cookieHeader);
  } catch (e) {
    // 토큰 만료 등 → 로그인 다시
    if ((e as ApiError).status === 401) redirect("/login?redirect=/me/bookmarks");
    throw e;
  }

  return (
    <main className="mx-auto max-w-screen-md space-y-6 px-4 py-8 md:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold">저장한 사용설명서</h1>
        <p className="mt-1 text-sm text-(--color-muted-foreground)">{items.length}개</p>
      </header>

      {items.length === 0 ? (
        <p className="rounded-md border bg-(--color-muted) p-8 text-center text-sm text-(--color-muted-foreground)">
          저장한 사용설명서가 없습니다. 매뉴얼 페이지에서 PDF별 ★ 저장 버튼을 눌러보세요.
        </p>
      ) : (
        <ul className="divide-y rounded-(--radius) border">
          {items.map(({ pdf, manual, company }) => (
            <li key={pdf.id} className="flex items-center gap-3 p-3 text-sm">
              <span className="rounded-md bg-(--color-muted) px-2 py-0.5 text-xs uppercase">
                {pdf.language}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">
                  {pdf.title ?? pdf.originFileName ?? "매뉴얼"}
                </div>
                <div className="truncate text-xs text-(--color-muted-foreground)">
                  <Link href={`/p/${manual.id}`} className="hover:underline">
                    {company.name} · {manual.name}
                  </Link>
                </div>
              </div>
              <a
                href={pdf.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-(--color-primary) hover:underline"
              >
                열기 →
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
