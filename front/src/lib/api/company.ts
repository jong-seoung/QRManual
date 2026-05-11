import { apiFetch } from "./client";

export interface Company {
  id: number;
  name: string;
  slug: string | null;
  officialMark: boolean;
  homePage: string | null;
}

export interface UpdateCompanyPayload {
  name?: string;
  homePage?: string;
  officialMark?: boolean;
}

export interface Member {
  id: number;
  username: string;
  email: string | null;
  fullName: string | null;
  companyRole: string;
  enabled: boolean;
}

export interface Invitation {
  id: number;
  email: string;
  role: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

export interface InvitationPreview {
  email: string;
  role: string;
  companyName: string;
}

export const companyApi = {
  getMine(cookieHeader?: string) {
    return apiFetch<Company>("/company/me", { method: "GET", cookieHeader });
  },

  updateMine(payload: UpdateCompanyPayload) {
    return apiFetch<Company>("/company/me", { method: "PATCH", body: payload });
  },

  // 멤버
  listMembers() {
    return apiFetch<Member[]>("/company/me/members", { method: "GET" });
  },

  updateMemberRole(id: number, role: "OWNER" | "ADMIN" | "USER") {
    return apiFetch<Member>(`/company/me/members/${id}`, { method: "PATCH", body: { role } });
  },

  removeMember(id: number) {
    return apiFetch<void>(`/company/me/members/${id}`, { method: "DELETE" });
  },

  // 초대
  listInvitations() {
    return apiFetch<Invitation[]>("/company/me/invitations", { method: "GET" });
  },

  createInvitation(email: string, role: "ADMIN" | "USER") {
    return apiFetch<Invitation>("/company/me/invitations", {
      method: "POST",
      body: { email, role },
    });
  },

  cancelInvitation(id: number) {
    return apiFetch<void>(`/company/me/invitations/${id}`, { method: "DELETE" });
  },

  // 공개 — 초대 코드 미리보기
  previewInvitation(code: string) {
    return apiFetch<InvitationPreview>(`/invitations/${encodeURIComponent(code)}`, {
      method: "GET",
    });
  },
};
