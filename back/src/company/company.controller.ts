import { Body, Controller, ForbiddenException, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CompanyRoles } from "@/auth/decorators/company-roles.decorator";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { CompanyRole, type User } from "@/db/schema/users";

import { CompanyService } from "./company.service";
import { CompanyResponseDto } from "./dto/company-response.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@ApiTags("company")
@Controller("api/company")
export class CompanyController {
  constructor(private readonly companies: CompanyService) {}

  @Get("me")
  @ApiOperation({ summary: "내가 속한 회사 정보" })
  async getMine(@CurrentUser() user: User): Promise<CompanyResponseDto> {
    if (!user.companyId) throw new ForbiddenException("not a member of any company");
    const company = await this.companies.findById(user.companyId);
    return CompanyResponseDto.from(company);
  }

  @Patch("me")
  @CompanyRoles(CompanyRole.OWNER)
  @ApiOperation({ summary: "회사 정보 수정 — OWNER 전용" })
  async updateMine(
    @CurrentUser() user: User,
    @Body() dto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    if (!user.companyId) throw new ForbiddenException("no company");
    const company = await this.companies.update(user.companyId, dto);
    return CompanyResponseDto.from(company);
  }
}
