import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/server";

// OAuth2 성공 후 백엔드가 쿠키를 셋업하고 이 경로로 리다이렉트한다.
// 여기서는 세션 확인하고 홈으로.
export default async function OAuth2CallbackPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?error=oauth2");
  redirect("/");
}
