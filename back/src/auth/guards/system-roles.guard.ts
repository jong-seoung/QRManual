import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import type { SystemRole, User } from "@/db/schema/users";

import { SYSTEM_ROLES_KEY } from "../decorators/system-roles.decorator";

@Injectable()
export class SystemRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<SystemRole[]>(SYSTEM_ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = ctx.switchToHttp().getRequest<{ user?: User }>();
    const user = req.user;
    if (!user || !user.systemRole || !required.includes(user.systemRole as SystemRole)) {
      throw new ForbiddenException("system role required");
    }
    return true;
  }
}
