import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { getCurrentUser } from "@/lib/auth/server";
import { isAdminOrAbove } from "@/lib/auth/types";

import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export async function Header() {
  const t = await getTranslations("header");
  const user = await getCurrentUser();
  const showAdmin = isAdminOrAbove(user);

  return (
    <header className="sticky top-0 z-40 border-b bg-(--color-background)/90 backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-4">
        <Link href="/" className="font-bold tracking-tight">
          QRManual
        </Link>

        <nav className="hidden items-center gap-4 text-sm sm:flex">
          <Link href="/manuals" className="hover:text-(--color-primary)">
            {t("searchManuals")}
          </Link>
          {user ? (
            <Link href="/me/bookmarks" className="hover:text-(--color-primary)">
              {t("myBookmarks")}
            </Link>
          ) : null}
          {showAdmin ? (
            <>
              <Link href="/admin/manuals" className="hover:text-(--color-primary)">
                {t("adminManuals")}
              </Link>
              <Link href="/admin/company" className="hover:text-(--color-primary)">
                {t("adminCompany")}
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
                {t("login")}
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-(--color-primary) px-3 py-1.5 text-(--color-primary-foreground) hover:opacity-90"
              >
                {t("signup")}
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
