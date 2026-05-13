import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/server";
import { isAdminOrAbove, isOwner } from "@/lib/auth/types";

import { CompanyInfoSection } from "./company-info";
import { InvitationsSection } from "./invitations-section";
import { MembersSection } from "./members-section";

export const metadata = { title: "회사 관리 — QRManual" };

export default async function CompanyAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/admin/company");
  if (!isAdminOrAbove(user)) redirect("/?error=forbidden");

  return (
    <main className="space-y-6 py-8">
      <header>
        <h1 className="text-3xl font-bold">회사 관리</h1>
        <p className="mt-1 text-sm text-(--color-muted-foreground)">
          현재 역할: <strong>{user.companyRole}</strong>
        </p>
      </header>

      <CompanyInfoSection canEdit={isOwner(user)} />
      <MembersSection canManage={isOwner(user)} currentUserId={user.id} />
      <InvitationsSection />
    </main>
  );
}
