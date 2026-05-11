import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, type StrategyOptions } from "passport-google-oauth20";

import type { OAuthProfile } from "./oauth.types";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(config: ConfigService) {
    const opts: StrategyOptions = {
      clientID: config.getOrThrow("GOOGLE_CLIENT_ID"),
      clientSecret: config.getOrThrow("GOOGLE_CLIENT_SECRET"),
      callbackURL: config.getOrThrow("OAUTH2_GOOGLE_CALLBACK"),
      scope: ["email", "profile"],
    };
    super(opts);
  }

  validate(_at: string, _rt: string, profile: Profile): OAuthProfile {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new UnauthorizedException("Google account has no email");
    return {
      provider: "GOOGLE",
      providerId: profile.id,
      email,
      name: profile.displayName ?? email.split("@")[0],
      avatarUrl: profile.photos?.[0]?.value,
    };
  }
}
