import { type DynamicModule, Module, type Provider, type Type } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CompanyRolesGuard } from "./guards/company-roles.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { SystemRolesGuard } from "./guards/system-roles.guard";
import { MailService } from "./mail.service";
import { OAuthController } from "./oauth.controller";
import { OAuthService } from "./oauth.service";
import { GithubStrategy } from "./strategies/github.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtAccessStrategy } from "./strategies/jwt-access.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { TokenService } from "./token.service";
import { UsersService } from "./users.service";

// OAuth provider/controller는 환경변수가 채워져 있을 때만 등록.
// 비어 있으면 Strategy 생성자에서 throw하므로 dev에서 OAuth 미설정 상태로도 부팅 가능해야 함.
function buildOAuthExtras(): { providers: Provider[]; controllers: Type<unknown>[] } {
  const hasGoogle = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const hasGithub = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
  if (!hasGoogle && !hasGithub) return { providers: [], controllers: [] };

  const providers: Provider[] = [OAuthService];
  if (hasGoogle) providers.push(GoogleStrategy);
  if (hasGithub) providers.push(GithubStrategy);
  return { providers, controllers: [OAuthController] };
}

@Module({})
export class AuthModule {
  static register(): DynamicModule {
    const { providers: oauthProviders, controllers: oauthControllers } = buildOAuthExtras();
    return {
      module: AuthModule,
      imports: [PassportModule, JwtModule.register({})],
      controllers: [AuthController, ...oauthControllers],
      providers: [
        AuthService,
        UsersService,
        MailService,
        TokenService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        ...oauthProviders,
        // 가드 순서: 인증 → 시스템 역할 → 회사 역할
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: SystemRolesGuard },
        { provide: APP_GUARD, useClass: CompanyRolesGuard },
      ],
      exports: [UsersService, TokenService],
    };
  }
}
