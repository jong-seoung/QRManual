import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy, type StrategyOptions } from "passport-jwt";

import type { User } from "@/db/schema/users";

import type { RefreshPayload } from "../token.service";
import { UsersService } from "../users.service";

const refreshCookieExtractor = (req: Request): string | null => {
  const cookies = req.cookies as Record<string, string> | undefined;
  return cookies?.refresh_token ?? null;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(
    config: ConfigService,
    private readonly users: UsersService,
  ) {
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([refreshCookieExtractor]),
      secretOrKey: config.getOrThrow("JWT_REFRESH_SECRET"),
      ignoreExpiration: false,
    };
    super(opts);
  }

  async validate(payload: RefreshPayload): Promise<User> {
    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException("Invalid refresh token");
    return user;
  }
}
