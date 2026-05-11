import { cookies } from "next/headers";

import { apiFetch } from "@/lib/api/client";

import type { AuthUser } from "./types";

// 서버 컴포넌트에서 현재 사용자 조회.
// /auth/me는 access 토큰을 검증한다 — 후속 fetch도 access를 쓰므로 일관성 유지.
// (이전에 /auth/refresh를 쓰던 시절엔 refresh로는 통과 후 access로는 401나는 미스매치 발생)
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieHeader = await getCookieHeader();
  if (!cookieHeader) return null;

  try {
    return await apiFetch<AuthUser>("/auth/me", { method: "GET", cookieHeader });
  } catch {
    return null;
  }
}

export async function getCookieHeader(): Promise<string> {
  const store = await cookies();
  return store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}
