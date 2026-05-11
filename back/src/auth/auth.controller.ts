import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import type { User } from "@/db/schema/users";

import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Public } from "./decorators/public.decorator";
import { AcceptInviteDto } from "./dto/accept-invite.dto";
import { ChangeOwnPasswordDto } from "./dto/change-own-password.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { EmailDto } from "./dto/email.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UpdateMeDto } from "./dto/update-me.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { TokenService } from "./token.service";
import { UsersService } from "./users.service";

@ApiTags("auth")
@Controller("api/auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly tokens: TokenService,
    private readonly users: UsersService,
  ) {}

  @Public()
  @Post("register")
  @ApiOperation({ summary: "회원가입 (이메일 인증은 별도 호출)" })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "이메일/비번 로그인 — httpOnly 쿠키 셋업" })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { access, refresh, userId } = await this.auth.login(dto);
    this.tokens.setAuthCookies(res, access, refresh);
    const user = await this.users.findById(userId);
    return { user: user ? UserResponseDto.from(user) : null };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "refresh 쿠키로 access/refresh 재발급" })
  async refresh(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    const { access, refresh } = await this.auth.refresh(user.id);
    this.tokens.setAuthCookies(res, access, refresh);
    return { user: UserResponseDto.from(user) };
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "쿠키 삭제" })
  logout(@Res({ passthrough: true }) res: Response): void {
    this.tokens.clearAuthCookies(res);
  }

  @Public()
  @Post("sendEmail")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "이메일 인증코드 발송" })
  async sendEmail(@Body() dto: EmailDto) {
    await this.auth.sendVerificationEmail(dto.email);
    return { message: "send email is success" };
  }

  @Public()
  @Post("verifyEmail/:emailCode")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "이메일 인증코드 검증 → enabled = true" })
  verifyEmail(@Body() dto: EmailDto, @Param("emailCode") emailCode: string) {
    return this.auth.verifyEmailCode(dto.email, emailCode);
  }

  @Public()
  @Post("findPw/:emailCode")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "비번 재설정 코드 발급" })
  findPw(@Body() dto: EmailDto, @Param("emailCode") emailCode: string) {
    return this.auth.issuePasswordResetCode(dto.email, emailCode);
  }

  @Public()
  @Post("changePw")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "비번 변경 (재설정 코드 필요)" })
  async changePw(@Body() dto: ChangePasswordDto) {
    await this.auth.changePassword(dto);
    return { message: "Password changed successfully." };
  }

  @Public()
  @Post("accept-invite")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "초대 코드로 가입 (회사 + ADMIN/USER 역할)" })
  async acceptInvite(@Body() dto: AcceptInviteDto) {
    return this.auth.acceptInvite(dto);
  }

  @Get("me")
  @ApiOperation({ summary: "내 정보 조회" })
  me(@CurrentUser() user: User): UserResponseDto {
    return UserResponseDto.from(user);
  }

  @Patch("me")
  @ApiOperation({ summary: "내 프로필 수정 (이름·주소·프로필 이미지)" })
  async updateMe(
    @CurrentUser() user: User,
    @Body() dto: UpdateMeDto,
  ): Promise<UserResponseDto> {
    await this.auth.updateMe(user.id, dto);
    const updated = await this.users.findById(user.id);
    return UserResponseDto.from(updated!);
  }

  @Post("me/password")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "본인 비밀번호 변경 (현재 비번 필요)" })
  async changeOwnPassword(
    @CurrentUser() user: User,
    @Body() dto: ChangeOwnPasswordDto,
  ): Promise<void> {
    await this.auth.changeOwnPassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
      dto.newPasswordConfirm,
    );
  }
}
