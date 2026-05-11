import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy, type StrategyOptions } from "passport-jwt";

import type { User } from "@/db/schema/users";

import type { AccessPayload } from "../token.service";
import { UsersService } from "../users.service";

const cookieExtractor = (req: Request): string | null => {
  const cookies = req.cookies as Record<string, string> | undefined;
  return cookies?.access_token ?? null;
};

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "jwt-access") {
  constructor(
    config: ConfigService,
    private readonly users: UsersService,
  ) {
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor, ExtractJwt.fromAuthHeaderAsBearerToken()]),
      secretOrKey: config.getOrThrow("JWT_ACCESS_SECRET"),
      ignoreExpiration: false,
    };
    super(opts);
  }

  async validate(payload: AccessPayload): Promise<User> {
    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
