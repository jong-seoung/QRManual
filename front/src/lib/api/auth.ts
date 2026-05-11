import { apiFetch } from "./client";
import type { AuthUser } from "../auth/types";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  address?: string;
  // 회사 (선택). 값이 있으면 OWNER로 새 회사 생성, 없으면 일반 사용자.
  companyName?: string;
  homePage?: string;
  officialMark?: boolean;
}

export interface AcceptInvitePayload {
  code: string;
  username: string;
  password: string;
  fullName?: string;
}

export interface LoginPayload {
  email?: string;
  username?: string;
  password: string;
}

export interface ChangePasswordPayload {
  email: string;
  authCode: string;
  password: string;
  password2: string;
}

export const authApi = {
  register(payload: RegisterPayload) {
    return apiFetch<{ message: string }>("/auth/register", { method: "POST", body: payload });
  },

  acceptInvite(payload: AcceptInvitePayload) {
    return apiFetch<{ message: string }>("/auth/accept-invite", { method: "POST", body: payload });
  },

  login(payload: LoginPayload) {
    return apiFetch<{ user: AuthUser }>("/auth/login", { method: "POST", body: payload });
  },

  refresh() {
    return apiFetch<{ user: AuthUser }>("/auth/refresh", { method: "POST" });
  },

  logout() {
    return apiFetch<void>("/auth/logout", { method: "POST" });
  },

  sendVerificationEmail(email: string) {
    return apiFetch<{ message: string }>("/auth/sendEmail", { method: "POST", body: { email } });
  },

  verifyEmail(email: string, code: string) {
    return apiFetch<boolean>(`/auth/verifyEmail/${encodeURIComponent(code)}`, {
      method: "POST",
      body: { email },
    });
  },

  issuePasswordResetCode(email: string, emailCode: string) {
    return apiFetch<string>(`/auth/findPw/${encodeURIComponent(emailCode)}`, {
      method: "POST",
      body: { email },
    });
  },

  changePassword(payload: ChangePasswordPayload) {
    return apiFetch<{ message: string }>("/auth/changePw", { method: "POST", body: payload });
  },

  // 본인 정보
  getMe() {
    return apiFetch<AuthUser>("/auth/me", { method: "GET" });
  },

  updateMe(payload: { fullName?: string; address?: string; profileImageUrl?: string }) {
    return apiFetch<AuthUser>("/auth/me", { method: "PATCH", body: payload });
  },

  changeOwnPassword(payload: {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }) {
    return apiFetch<void>("/auth/me/password", { method: "POST", body: payload });
  },
};
