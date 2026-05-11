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
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CompanyRoles } from "@/auth/decorators/company-roles.decorator";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { CompanyRole, type User } from "@/db/schema/users";

import {
  CreateManualDto,
  ListManualsQueryDto,
  ManualResponseDto,
  UpdateManualDto,
} from "./dto/manual.dto";
import { ManualsService } from "./manuals.service";

@ApiTags("manuals")
@Controller("api/manuals")
export class ManualsController {
  constructor(private readonly manuals: ManualsService) {}

  @Get()
  @ApiOperation({ summary: "매뉴얼 목록 (인증된 사용자 누구나)" })
  async list(@Query() q: ListManualsQueryDto) {
    const result = await this.manuals.list({
      page: q.page ?? 0,
      size: q.size ?? 20,
      keyword: q.keyword,
      companyId: q.companyId,
    });
    return {
      items: result.items.map(ManualResponseDto.from),
      total: result.total,
      page: result.page,
      size: result.size,
    };
  }

  @Get(":id")
  @ApiOperation({ summary: "매뉴얼 상세" })
  async detail(@Param("id", ParseIntPipe) id: number): Promise<ManualResponseDto> {
    const m = await this.manuals.findById(id);
    return ManualResponseDto.from(m);
  }

  @Post()
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "매뉴얼 생성 — OWNER/ADMIN 전용" })
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateManualDto,
  ): Promise<ManualResponseDto> {
    const created = await this.manuals.create(user, {
      name: dto.name,
      imageUrl: dto.imageUrl,
      modelCode: dto.modelCode,
      releaseYear: dto.releaseYear,
      serialNumberLocation: dto.serialNumberLocation,
      productPage: dto.productPage,
      publicStoreLink: dto.publicStoreLink,
    });
    return ManualResponseDto.from(created);
  }

  @Patch(":id")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "매뉴얼 수정 — 같은 회사 OWNER/ADMIN" })
  async update(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateManualDto,
  ): Promise<ManualResponseDto> {
    const updated = await this.manuals.update(user, id, dto);
    return ManualResponseDto.from(updated);
  }

  @Delete(":id")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "매뉴얼 삭제 (소프트) — 같은 회사 OWNER/ADMIN" })
  async remove(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<void> {
    await this.manuals.softDelete(user, id);
  }
}
