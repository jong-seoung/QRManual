import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as argon2 from "argon2";

import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { companies } from "@/db/schema/companies";
import { invitations } from "@/db/schema/invitations";
import { AuthProvider, CompanyRole, users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

import type { AcceptInviteDto } from "./dto/accept-invite.dto";
import type { ChangePasswordDto } from "./dto/change-password.dto";
import type { LoginDto } from "./dto/login.dto";
import type { RegisterDto } from "./dto/register.dto";
import { MailService } from "./mail.service";
import { TokenService } from "./token.service";
import { UsersService } from "./users.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
    private readonly users: UsersService,
    private readonly tokens: TokenService,
    private readonly mail: MailService,
  ) {}

  // 공개 가입 — companyName 유무에 따라 분기.
  // - 일반(personal): users 한 행만. company_id/company_role NULL.
  // - 회사(company): companies + users 트랜잭션, 가입자=OWNER.
  // (.env 변경 반영을 위한 watch trigger)
  async register(dto: RegisterDto): Promise<{ message: string; mode: "personal" | "company" }> {
    if (await this.users.existsByUsername(dto.username)) {
      throw new ConflictException("Username already exists");
    }
    if (await this.users.existsByEmail(dto.email)) {
      throw new ConflictException("Email already exists");
    }

    const hashed = await argon2.hash(dto.password);
    const isCompany = Boolean(dto.companyName);

    if (isCompany) {
      await this.db.transaction(async (tx) => {
        const [company] = await tx
          .insert(companies)
          .values({
            name: dto.companyName!,
            homePage: dto.homePage,
            officialMark: dto.officialMark ?? false,
          })
          .returning();

        await tx.insert(users).values({
          username: dto.username,
          email: dto.email,
          password: hashed,
          fullName: dto.fullName,
          address: dto.address,
          provider: AuthProvider.LOCAL,
          enabled: false, // 이메일 인증 후 true
          companyId: company.id,
          companyRole: CompanyRole.OWNER,
        });
      });
    } else {
      await this.users.create({
        username: dto.username,
        email: dto.email,
        password: hashed,
        fullName: dto.fullName,
        address: dto.address,
        provider: AuthProvider.LOCAL,
        enabled: false,
        // companyId·companyRole NULL — 일반 사용자
      });
    }

    return {
      message: "register success, check email",
      mode: isCompany ? "company" : "personal",
    };
  }

  // 초대 수락 — 기존 회사에 ADMIN/USER로 가입
  async acceptInvite(dto: AcceptInviteDto): Promise<{ message: string }> {
    const invite = await this.db.query.invitations.findFirst({
      where: eq(invitations.code, dto.code),
    });
    if (!invite) throw new BadRequestException("Invalid invitation code");
    if (invite.acceptedAt) throw new BadRequestException("Invitation already used");
    if (invite.expiresAt < new Date()) throw new BadRequestException("Invitation expired");

    if (await this.users.existsByUsername(dto.username)) {
      throw new ConflictException("Username already exists");
    }
    if (await this.users.existsByEmail(invite.email)) {
      throw new ConflictException("Email already registered");
    }

    const hashed = await argon2.hash(dto.password);

    await this.db.transaction(async (tx) => {
      await tx.insert(users).values({
        username: dto.username,
        email: invite.email,
        password: hashed,
        fullName: dto.fullName,
        provider: AuthProvider.LOCAL,
        enabled: true, // 초대 수락은 이메일 검증 한 번 더 안 시킴
        companyId: invite.companyId,
        companyRole: invite.role as "ADMIN" | "USER",
      });
      await tx
        .update(invitations)
        .set({ acceptedAt: new Date() })
        .where(eq(invitations.id, invite.id));
    });

    return { message: "invitation accepted" };
  }

  async login(dto: LoginDto): Promise<{ access: string; refresh: string; userId: number }> {
    const loginId = dto.email ?? dto.username;
    if (!loginId) throw new BadRequestException("email 또는 username 필수");

    const user = await this.users.findByLoginId(loginId);
    if (!user) throw new UnauthorizedException("Invalid email or password");

    if (!user.enabled) throw new UnauthorizedException("User is not activated");

    if (!user.password || !(await argon2.verify(user.password, dto.password))) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return {
      access: this.tokens.signAccess(user),
      refresh: this.tokens.signRefresh(user),
      userId: user.id,
    };
  }

  async refresh(userId: number): Promise<{ access: string; refresh: string; userId: number }> {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException("User not found");
    return {
      access: this.tokens.signAccess(user),
      refresh: this.tokens.signRefresh(user),
      userId: user.id,
    };
  }

  async sendVerificationEmail(email: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new BadRequestException("User not found");
    await this.mail.sendVerificationCode(email);
  }

  async verifyEmailCode(email: string, code: string): Promise<boolean> {
    const stored = await this.mail.getEmailCode(email);
    if (!stored || stored !== code) {
      throw new BadRequestException("wrong Code");
    }
    const user = await this.users.findByEmail(email);
    if (!user) throw new BadRequestException("User not found");
    await this.users.setEnabled(user.id, true);
    await this.mail.clearEmailCode(email);
    return true;
  }

  async issuePasswordResetCode(email: string, emailCode: string): Promise<string> {
    // 이메일 인증 코드를 다시 한번 검증한 뒤에 비번 재설정 코드를 발급 — 옛 흐름 유지
    const stored = await this.mail.getEmailCode(email);
    if (!stored || stored !== emailCode) {
      throw new BadRequestException("wrong Code");
    }
    const user = await this.users.findByEmail(email);
    if (!user) throw new BadRequestException("User not found");
    return this.mail.issuePasswordResetCode(email);
  }

  // 본인 프로필 부분 수정 (로그인 상태). username/email/role/companyId는 변경 불가.
  async updateMe(
    userId: number,
    patch: { fullName?: string; address?: string; profileImageUrl?: string },
  ): Promise<void> {
    await this.users.update(userId, patch);
  }

  // 본인 비번 변경 — 현재 비번 검증 후 교체. 이메일 인증 흐름 안 거침.
  async changeOwnPassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
  ): Promise<void> {
    if (newPassword !== newPasswordConfirm) {
      throw new BadRequestException("Passwords do not match.");
    }
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException("user not found");
    if (!user.password || !(await argon2.verify(user.password, currentPassword))) {
      throw new UnauthorizedException("현재 비밀번호가 맞지 않습니다");
    }
    const hashed = await argon2.hash(newPassword);
    await this.users.setPassword(userId, hashed);
  }

  async changePassword(dto: ChangePasswordDto): Promise<void> {
    const stored = await this.mail.getPasswordResetCode(dto.email);
    if (!stored || stored !== dto.authCode) {
      throw new BadRequestException("wrong Code");
    }
    if (dto.password !== dto.password2) {
      throw new BadRequestException("Passwords do not match.");
    }
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException("user not found");
    const hashed = await argon2.hash(dto.password);
    await this.users.setPassword(user.id, hashed);
    await this.mail.clearPasswordResetCode(dto.email);
  }
}
