import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/server";
import { isAdminOrAbove } from "@/lib/auth/types";

import { UserMenu } from "./user-menu";

export async function Header() {
  const user = await getCurrentUser();
  const showAdmin = isAdminOrAbove(user);

  return (
    <header className="sticky top-0 z-40 border-b bg-(--color-background)/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        <Link href="/" className="font-bold tracking-tight">
          QRManual
        </Link>

        <nav className="hidden items-center gap-4 text-sm sm:flex">
          <Link href="/manuals" className="hover:text-(--color-primary)">
            설명서 검색
          </Link>
          {user ? (
            <Link href="/me/bookmarks" className="hover:text-(--color-primary)">
              저장한 사용설명서
            </Link>
          ) : null}
          {showAdmin ? (
            <>
              <Link href="/admin/manuals" className="hover:text-(--color-primary)">
                설명서 관리
              </Link>
              <Link href="/admin/company" className="hover:text-(--color-primary)">
                회사
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link href="/login" className="hover:text-(--color-primary)">
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-(--color-primary) px-3 py-1.5 text-(--color-primary-foreground) hover:opacity-90"
              >
                가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
