import { Injectable } from "@nestjs/common";

import { type User } from "@/db/schema/users";

import type { OAuthProfile } from "./strategies/oauth.types";
import { TokenService } from "./token.service";
import { UsersService } from "./users.service";

@Injectable()
export class OAuthService {
  constructor(
    private readonly users: UsersService,
    private readonly tokens: TokenService,
  ) {}

  async loginOrCreate(profile: OAuthProfile): Promise<{ access: string; refresh: string; user: User }> {
    let user =
      (await this.users.findByProvider(profile.provider, profile.providerId)) ??
      (await this.users.findByEmail(profile.email));

    if (!user) {
      // OAuth 가입 — 회사 미배정 상태. 본인이 회사 만들거나 초대 받기 전엔 권한 없음.
      const username = await this.uniqueUsername(profile.email);
      user = await this.users.create({
        username,
        email: profile.email,
        password: "",
        fullName: profile.name,
        profileImageUrl: profile.avatarUrl,
        provider: profile.provider,
        providerId: profile.providerId,
        enabled: true,
      });
    } else if (!user.provider || !user.providerId) {
      // 기존 로컬 계정에 OAuth 연결
      user = await this.users.update(user.id, {
        provider: profile.provider,
        providerId: profile.providerId,
        profileImageUrl: profile.avatarUrl ?? user.profileImageUrl,
        enabled: true,
      });
    } else if (profile.avatarUrl && profile.avatarUrl !== user.profileImageUrl) {
      user = await this.users.update(user.id, { profileImageUrl: profile.avatarUrl });
    }

    return {
      access: this.tokens.signAccess(user),
      refresh: this.tokens.signRefresh(user),
      user,
    };
  }

  private async uniqueUsername(email: string): Promise<string> {
    const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    let candidate = base;
    let counter = 1;
    while (await this.users.existsByUsername(candidate)) {
      candidate = `${base}${counter++}`;
    }
    return candidate;
  }
}
