import { Suspense } from "react";

import { VerifyEmailForm } from "./verify-form";

export const metadata = { title: "이메일 인증 — QRManual" };

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
