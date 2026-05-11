import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CompanyRoles } from "@/auth/decorators/company-roles.decorator";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { CompanyRole, type User } from "@/db/schema/users";

import { MemberResponseDto } from "./dto/member-response.dto";
import { UpdateMemberRoleDto } from "./dto/update-member-role.dto";
import { MembersService } from "./members.service";

@ApiTags("company-members")
@Controller("api/company/me/members")
export class MembersController {
  constructor(private readonly members: MembersService) {}

  @Get()
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "회사 멤버 목록" })
  async list(@CurrentUser() user: User): Promise<MemberResponseDto[]> {
    if (!user.companyId) throw new ForbiddenException("no company");
    const members = await this.members.list(user.companyId);
    return members.map((m) => MemberResponseDto.from(m));
  }

  @Patch(":id")
  @CompanyRoles(CompanyRole.OWNER)
  @ApiOperation({ summary: "멤버 역할 변경 — OWNER 전용" })
  async updateRole(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateMemberRoleDto,
  ): Promise<MemberResponseDto> {
    if (!user.companyId) throw new ForbiddenException("no company");
    const updated = await this.members.setRole(user.companyId, id, dto.role);
    return MemberResponseDto.from(updated);
  }

  @Delete(":id")
  @CompanyRoles(CompanyRole.OWNER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "멤버 제거 — OWNER 전용" })
  async remove(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    if (!user.companyId) throw new ForbiddenException("no company");
    await this.members.remove(user.companyId, id);
  }
}
