import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/server";
import { isAdminOrAbove } from "@/lib/auth/types";

import { ManualCreateForm } from "./manual-create-form";

export const metadata = { title: "새 매뉴얼 — QRManual" };

export default async function NewManualPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/admin/manuals/new");
  if (!isAdminOrAbove(user)) redirect("/?error=forbidden");

  return (
    <main className="space-y-6 py-8">
      <header className="space-y-3">
        <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.003em] text-(--color-ink) md:text-[48px]">
          새 매뉴얼
        </h1>
        <p className="text-[17px] leading-[1.47] tracking-[-0.022em] text-(--color-ink-muted-80)">
          기본 정보 외에 PDF · 부품 · FAQ · 고객센터를 한 번에 등록할 수 있습니다.
        </p>
      </header>
      <ManualCreateForm />
    </main>
  );
}
