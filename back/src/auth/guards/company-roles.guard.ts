import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { type CompanyRole, SystemRole, type User } from "@/db/schema/users";

import { COMPANY_ROLES_KEY } from "../decorators/company-roles.decorator";

@Injectable()
export class CompanyRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<CompanyRole[]>(COMPANY_ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest<{ user?: User }>();
    const user = req.user;
    if (!user) throw new ForbiddenException("authentication required");

    // SUPER bypass — 어느 회사 어떤 역할이 필요해도 통과
    if (user.systemRole === SystemRole.SUPER) return true;

    if (!user.companyId || !user.companyRole) {
      throw new ForbiddenException("not a member of any company");
    }
    if (!required.includes(user.companyRole as CompanyRole)) {
      throw new ForbiddenException(`requires one of [${required.join(", ")}]`);
    }
    return true;
  }
}
