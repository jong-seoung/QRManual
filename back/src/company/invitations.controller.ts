import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { eq } from "drizzle-orm";

import { CompanyRoles } from "@/auth/decorators/company-roles.decorator";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { Public } from "@/auth/decorators/public.decorator";
import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { companies } from "@/db/schema/companies";
import { CompanyRole, type User } from "@/db/schema/users";

import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { InvitationPreviewDto, InvitationResponseDto } from "./dto/invitation-response.dto";
import { InvitationsService } from "./invitations.service";

@ApiTags("company-invitations")
@Controller("api/company/me/invitations")
export class InvitationsController {
  constructor(
    private readonly invitations: InvitationsService,
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
  ) {}

  @Get()
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "대기 초대 목록" })
  async list(@CurrentUser() user: User): Promise<InvitationResponseDto[]> {
    if (!user.companyId) throw new ForbiddenException("no company");
    const list = await this.invitations.list(user.companyId);
    return list.map(InvitationResponseDto.from);
  }

  @Post()
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "초대 발송" })
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateInvitationDto,
  ): Promise<InvitationResponseDto> {
    if (!user.companyId) throw new ForbiddenException("no company");
    const invite = await this.invitations.create(user.companyId, user, dto.email, dto.role);
    return InvitationResponseDto.from(invite);
  }

  @Delete(":id")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "초대 취소" })
  async cancel(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    if (!user.companyId) throw new ForbiddenException("no company");
    await this.invitations.cancel(user.companyId, id);
  }
}

// 초대 수락 페이지 미리보기 — 인증 없이도 코드로 조회
@ApiTags("invitation-public")
@Controller("api/invitations")
export class PublicInvitationController {
  constructor(
    private readonly invitations: InvitationsService,
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
  ) {}

  @Public()
  @Get(":code")
  @ApiOperation({ summary: "초대 코드로 회사명·이메일·역할 미리보기" })
  async preview(@Param("code") code: string): Promise<InvitationPreviewDto> {
    const invite = await this.invitations.findByCode(code);
    const company = await this.db.query.companies.findFirst({
      where: eq(companies.id, invite.companyId),
    });
    return {
      email: invite.email,
      role: invite.role,
      companyName: company?.name ?? "",
    };
  }
}
