import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { and, eq, isNull } from "drizzle-orm";

import { MailService } from "@/auth/mail.service";
import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { companies } from "@/db/schema/companies";
import { type Invitation, invitations } from "@/db/schema/invitations";
import { CompanyRole, type User, users } from "@/db/schema/users";

@Injectable()
export class InvitationsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  async create(
    companyId: number,
    inviter: User,
    email: string,
    role: typeof CompanyRole.ADMIN | typeof CompanyRole.USER,
  ): Promise<Invitation> {
    // 이미 회사에 속한 이메일이면 재초대 막음
    const existing = await this.db.query.users.findFirst({
      where: and(eq(users.email, email), eq(users.companyId, companyId)),
    });
    if (existing) throw new ConflictException("이미 회사 멤버입니다");

    // 같은 회사·이메일에 대기 초대가 있으면 거부 (중복 방지)
    const pending = await this.db.query.invitations.findFirst({
      where: and(
        eq(invitations.companyId, companyId),
        eq(invitations.email, email),
        isNull(invitations.acceptedAt),
      ),
    });
    if (pending && pending.expiresAt > new Date()) {
      throw new ConflictException("이미 발송된 초대가 있습니다");
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일
    const [invite] = await this.db
      .insert(invitations)
      .values({
        companyId,
        email,
        role,
        invitedById: inviter.id,
        expiresAt,
      })
      .returning();

    const company = await this.db.query.companies.findFirst({ where: eq(companies.id, companyId) });
    const frontendUrl = this.config.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
    const acceptUrl = `${frontendUrl}/accept-invite/${invite.code}`;

    await this.mail.sendInvitation({
      to: email,
      companyName: company?.name ?? "QRManual",
      role,
      acceptUrl,
      inviterName: inviter.fullName ?? inviter.username,
    });

    return invite;
  }

  list(companyId: number): Promise<Invitation[]> {
    return this.db.query.invitations.findMany({
      where: and(eq(invitations.companyId, companyId), isNull(invitations.acceptedAt)),
    });
  }

  async cancel(companyId: number, invitationId: number): Promise<void> {
    const invite = await this.db.query.invitations.findFirst({
      where: and(eq(invitations.id, invitationId), eq(invitations.companyId, companyId)),
    });
    if (!invite) throw new NotFoundException("Invitation not found");
    if (invite.acceptedAt) throw new BadRequestException("이미 수락된 초대는 취소 불가");
    await this.db.delete(invitations).where(eq(invitations.id, invitationId));
  }

  // 코드로 조회 (수락 페이지 미리보기용 — 회사명 등 표시 위해)
  async findByCode(code: string): Promise<Invitation> {
    const invite = await this.db.query.invitations.findFirst({
      where: eq(invitations.code, code),
    });
    if (!invite) throw new NotFoundException("Invitation not found");
    if (invite.acceptedAt) throw new ForbiddenException("Invitation already used");
    if (invite.expiresAt < new Date()) throw new ForbiddenException("Invitation expired");
    return invite;
  }
}
