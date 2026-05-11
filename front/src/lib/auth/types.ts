export interface AuthUser {
  id: number;
  username: string;
  email: string | null;
  fullName: string | null;
  profileImageUrl: string | null;
  address: string | null;
  enabled: boolean;
  systemRole: string | null; // 'SUPER' | null
  companyId: number | null;
  companyRole: string | null; // 'OWNER' | 'ADMIN' | 'USER' | null
  provider: string | null;
}

export const SystemRole = { SUPER: "SUPER" } as const;
export const CompanyRole = { OWNER: "OWNER", ADMIN: "ADMIN", USER: "USER" } as const;

export function isSuper(user: AuthUser | null): boolean {
  return user?.systemRole === SystemRole.SUPER;
}

export function isOwner(user: AuthUser | null): boolean {
  return user?.companyRole === CompanyRole.OWNER;
}

export function isAdminOrAbove(user: AuthUser | null): boolean {
  if (!user) return false;
  if (isSuper(user) || isOwner(user)) return true;
  return user.companyRole === CompanyRole.ADMIN;
}
