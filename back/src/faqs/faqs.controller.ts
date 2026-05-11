import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CompanyRoles } from "@/auth/decorators/company-roles.decorator";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { CompanyRole, type User } from "@/db/schema/users";

import { CreateFaqDto, FaqResponseDto, UpdateFaqDto } from "./dto/faq.dto";
import { FaqsService } from "./faqs.service";

@ApiTags("faqs")
@Controller("api")
export class FaqsController {
  constructor(private readonly faqs: FaqsService) {}

  @Get("manuals/:manualId/faqs")
  @ApiOperation({ summary: "매뉴얼의 FAQ 목록" })
  async list(@Param("manualId", ParseIntPipe) manualId: number): Promise<FaqResponseDto[]> {
    const list = await this.faqs.listByManual(manualId);
    return list.map(FaqResponseDto.from);
  }

  @Post("manuals/:manualId/faqs")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "FAQ 추가" })
  async create(
    @CurrentUser() user: User,
    @Param("manualId", ParseIntPipe) manualId: number,
    @Body() dto: CreateFaqDto,
  ): Promise<FaqResponseDto> {
    const created = await this.faqs.create(user, manualId, dto);
    return FaqResponseDto.from(created);
  }

  @Patch("faqs/:id")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "FAQ 수정" })
  async update(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateFaqDto,
  ): Promise<FaqResponseDto> {
    const updated = await this.faqs.update(user, id, dto);
    return FaqResponseDto.from(updated);
  }

  @Delete("faqs/:id")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "FAQ 삭제" })
  async remove(@CurrentUser() user: User, @Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.faqs.remove(user, id);
  }
}
