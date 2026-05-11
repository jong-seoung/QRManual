import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { Public } from "./decorators/public.decorator";
import { OAuthService } from "./oauth.service";
import type { OAuthProfile } from "./strategies/oauth.types";
import { TokenService } from "./token.service";

@ApiTags("auth-oauth2")
@Controller("api/auth/oauth2")
export class OAuthController {
  constructor(
    private readonly oauth: OAuthService,
    private readonly tokens: TokenService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  @ApiExcludeEndpoint()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleStart(): void {}

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  @ApiExcludeEndpoint()
  async googleCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.handleCallback(req, res);
  }

  @Public()
  @Get("github")
  @UseGuards(AuthGuard("github"))
  @ApiExcludeEndpoint()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  githubStart(): void {}

  @Public()
  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  @ApiExcludeEndpoint()
  async githubCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.handleCallback(req, res);
  }

  private async handleCallback(req: Request, res: Response): Promise<void> {
    const profile = req.user as OAuthProfile;
    const { access, refresh } = await this.oauth.loginOrCreate(profile);
    this.tokens.setAuthCookies(res, access, refresh);
    const frontend = this.config.get<string>("FRONTEND_URL") ?? "/";
    res.redirect(`${frontend}/oauth2/callback`);
  }
}
