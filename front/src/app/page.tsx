import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { getCurrentUser } from "@/lib/auth/server";

export default async function HomePage() {
  const t = await getTranslations("auth");
  const user = await getCurrentUser();

  return (
    <main className="mx-auto max-w-screen-xl space-y-6 px-4 py-8 md:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">QRManual</h1>
      <p className="mt-4 text-lg text-(--color-muted-foreground)">
        QR로 매뉴얼·제품 정보를 즉시.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/manuals"
          className="rounded-md bg-(--color-primary) px-4 py-2 text-(--color-primary-foreground) hover:opacity-90"
        >
          설명서 검색
        </Link>

        {user ? (
          <>
            <span className="rounded-md bg-(--color-muted) px-4 py-2">
              {user.username}
              {user.companyRole ? ` · ${user.companyRole}` : null}
            </span>
            <Link
              href="/me/bookmarks"
              className="rounded-md border px-4 py-2 hover:bg-(--color-muted)"
            >
              저장한 사용설명서
            </Link>
            {user.companyRole === "OWNER" || user.companyRole === "ADMIN" ? (
              <>
                <Link
                  href="/admin/manuals"
                  className="rounded-md border px-4 py-2 hover:bg-(--color-muted)"
                >
                  설명서 관리
                </Link>
                <Link
                  href="/admin/company"
                  className="rounded-md border px-4 py-2 hover:bg-(--color-muted)"
                >
                  회사 관리
                </Link>
              </>
            ) : null}
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-md border px-4 py-2 hover:bg-(--color-muted)"
            >
              {t("login")}
            </Link>
            <Link
              href="/signup"
              className="rounded-md border px-4 py-2 hover:bg-(--color-muted)"
            >
              {t("signup")}
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
