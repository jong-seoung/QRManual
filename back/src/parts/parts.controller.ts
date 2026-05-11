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

import { CreatePartDto, PartResponseDto, UpdatePartDto } from "./dto/part.dto";
import { PartsService } from "./parts.service";

@ApiTags("parts")
@Controller("api")
export class PartsController {
  constructor(private readonly parts: PartsService) {}

  @Get("manuals/:manualId/parts")
  @ApiOperation({ summary: "매뉴얼의 부품 목록" })
  async list(@Param("manualId", ParseIntPipe) manualId: number): Promise<PartResponseDto[]> {
    const list = await this.parts.listByManual(manualId);
    return list.map(PartResponseDto.from);
  }

  @Post("manuals/:manualId/parts")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "부품 추가" })
  async create(
    @CurrentUser() user: User,
    @Param("manualId", ParseIntPipe) manualId: number,
    @Body() dto: CreatePartDto,
  ): Promise<PartResponseDto> {
    const created = await this.parts.create(user, manualId, dto);
    return PartResponseDto.from(created);
  }

  @Patch("parts/:id")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "부품 수정" })
  async update(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePartDto,
  ): Promise<PartResponseDto> {
    const updated = await this.parts.update(user, id, dto);
    return PartResponseDto.from(updated);
  }

  @Delete("parts/:id")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "부품 삭제" })
  async remove(@CurrentUser() user: User, @Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.parts.remove(user, id);
  }
}
