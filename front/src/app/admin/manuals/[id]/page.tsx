import { notFound, redirect } from "next/navigation";

import { type ApiError } from "@/lib/api/client";
import { manualsApi } from "@/lib/api/manuals";
import { getCookieHeader, getCurrentUser } from "@/lib/auth/server";
import { isAdminOrAbove } from "@/lib/auth/types";

import { ManualForm } from "../manual-form";
import { CustomerServiceSection } from "./customer-service-section";
import { FaqsSection } from "./faqs-section";
import { PartsSection } from "./parts-section";
import { PdfsSection } from "./pdfs-section";
import { QrSection } from "./qr-section";

export const metadata = { title: "매뉴얼 수정 — QRManual" };

export default async function EditManualPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isAdminOrAbove(user)) redirect("/?error=forbidden");

  const { id } = await params;
  const manualId = Number(id);
  if (!Number.isFinite(manualId)) notFound();

  const cookieHeader = await getCookieHeader();

  let manual;
  try {
    manual = await manualsApi.detail(manualId, cookieHeader);
  } catch (e) {
    const err = e as ApiError;
    if (err.status === 404) notFound();
    if (err.status === 401) redirect(`/login?redirect=/admin/manuals/${manualId}`);
    throw e;
  }

  if (manual.companyId !== user.companyId && user.systemRole !== "SUPER") {
    redirect("/admin/manuals?error=forbidden");
  }

  return (
    <main className="space-y-6 py-8">
      <h1 className="text-3xl font-bold">매뉴얼 수정</h1>
      <ManualForm mode="edit" manual={manual} />
      <PdfsSection manualId={manual.id} />
      <PartsSection manualId={manual.id} />
      <FaqsSection manualId={manual.id} />
      <CustomerServiceSection manualId={manual.id} />
      <QrSection manualId={manual.id} manualName={manual.name} />
    </main>
  );
}
