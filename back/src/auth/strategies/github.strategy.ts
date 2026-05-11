import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, type StrategyOptions, type Profile } from "passport-github2";

import type { OAuthProfile } from "./oauth.types";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(config: ConfigService) {
    const opts: StrategyOptions = {
      clientID: config.getOrThrow("GITHUB_CLIENT_ID"),
      clientSecret: config.getOrThrow("GITHUB_CLIENT_SECRET"),
      callbackURL: config.getOrThrow("OAUTH2_GITHUB_CALLBACK"),
      scope: ["user:email"],
    };
    super(opts);
  }

  validate(_at: string, _rt: string, profile: Profile): OAuthProfile {
    const primaryEmail = profile.emails?.[0]?.value;
    // 옛 OAuth2SuccessHandler 동일 정책: GitHub 이메일 비공개면 login@github.local로 대체
    const email = primaryEmail ?? `${profile.username ?? profile.id}@github.local`;
    return {
      provider: "GITHUB",
      providerId: profile.id,
      email,
      name: profile.displayName ?? profile.username ?? "User",
      avatarUrl: profile.photos?.[0]?.value,
    };
  }
}
