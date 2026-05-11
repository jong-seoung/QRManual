import { notFound } from "next/navigation";

import { companyApi } from "@/lib/api/company";
import type { ApiError } from "@/lib/api/client";

import { AcceptInviteForm } from "./accept-form";

export const metadata = { title: "초대 수락 — QRManual" };

export default async function AcceptInvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  let preview;
  try {
    preview = await companyApi.previewInvitation(code);
  } catch (e) {
    const err = e as ApiError;
    if (err.status === 404 || err.status === 403) notFound();
    throw e;
  }
  return <AcceptInviteForm code={code} preview={preview} />;
}
