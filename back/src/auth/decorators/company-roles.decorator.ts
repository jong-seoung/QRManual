import { SetMetadata } from "@nestjs/common";

import type { CompanyRole } from "@/db/schema/users";

export const COMPANY_ROLES_KEY = "companyRoles";

// 회사 단위 역할 요구. SUPER는 항상 통과.
// 사용 예: @CompanyRoles("OWNER") / @CompanyRoles("OWNER", "ADMIN")
export const CompanyRoles = (...roles: CompanyRole[]) => SetMetadata(COMPANY_ROLES_KEY, roles);
