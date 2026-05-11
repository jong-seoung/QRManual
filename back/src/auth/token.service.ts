import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";

import type { User } from "@/db/schema/users";

export interface AccessPayload {
  sub: number; // user.id
  username: string;
  email: string | null;
  systemRole: string | null;
  companyId: number | null;
  companyRole: string | null;
}

export interface RefreshPayload {
  sub: number;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  signAccess(user: User): string {
    const payload: AccessPayload = {
      sub: user.id,
      username: user.username,
      email: user.email ?? null,
      systemRole: user.systemRole ?? null,
      companyId: user.companyId ?? null,
      companyRole: user.companyRole ?? null,
    };
    return this.jwt.sign(payload, {
      secret: this.config.getOrThrow("JWT_ACCESS_SECRET"),
      expiresIn: Number(this.config.get("JWT_ACCESS_TTL") ?? 900),
    });
  }

  signRefresh(user: User): string {
    const payload: RefreshPayload = { sub: user.id };
    return this.jwt.sign(payload, {
      secret: this.config.getOrThrow("JWT_REFRESH_SECRET"),
      expiresIn: Number(this.config.get("JWT_REFRESH_TTL") ?? 604800),
    });
  }

  setAuthCookies(res: Response, access: string, refresh: string): void {
    const isProd = this.config.get("NODE_ENV") === "production";
    const domain = this.config.get<string>("COOKIE_DOMAIN");
    res.cookie("access_token", access, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      domain,
      path: "/",
      maxAge: Number(this.config.get("JWT_ACCESS_TTL") ?? 900) * 1000,
    });
    res.cookie("refresh_token", refresh, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      domain,
      path: "/",
      maxAge: Number(this.config.get("JWT_REFRESH_TTL") ?? 604800) * 1000,
    });
  }

  clearAuthCookies(res: Response): void {
    const domain = this.config.get<string>("COOKIE_DOMAIN");
    res.clearCookie("access_token", { domain, path: "/" });
    res.clearCookie("refresh_token", { domain, path: "/" });
  }
}
