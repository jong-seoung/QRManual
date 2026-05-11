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
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CompanyRoles } from "@/auth/decorators/company-roles.decorator";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { CompanyRole, type User } from "@/db/schema/users";

import {
  CreateManualPdfDto,
  ManualPdfResponseDto,
  UpdateManualPdfDto,
} from "./dto/manual-pdf.dto";
import { ManualPdfsService } from "./manual-pdfs.service";

@ApiTags("manual-pdfs")
@Controller("api")
export class ManualPdfsController {
  constructor(
    private readonly pdfs: ManualPdfsService,
    private readonly config: ConfigService,
  ) {}

  // 매뉴얼의 PDF 목록 — 인증 누구나
  @Get("manuals/:manualId/pdfs")
  @ApiOperation({ summary: "매뉴얼의 PDF 파일 목록" })
  async listByManual(
    @Param("manualId", ParseIntPipe) manualId: number,
  ): Promise<ManualPdfResponseDto[]> {
    const list = await this.pdfs.listByManual(manualId);
    return list.map(ManualPdfResponseDto.from);
  }

  @Post("manuals/:manualId/pdfs")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "PDF 업로드" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
        language: { type: "string" },
        title: { type: "string" },
      },
      required: ["file", "language"],
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @CurrentUser() user: User,
    @Param("manualId", ParseIntPipe) manualId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateManualPdfDto,
  ): Promise<ManualPdfResponseDto> {
    const max = Number(this.config.get("UPLOAD_MAX_SIZE") ?? 10 * 1024 * 1024);
    if (file && file.size > max) {
      throw new Error(`파일이 너무 큽니다 (max ${max} bytes)`);
    }
    const created = await this.pdfs.create(user, manualId, file, {
      language: dto.language,
      title: dto.title,
    });
    return ManualPdfResponseDto.from(created);
  }

  @Patch("manual-pdfs/:id")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @ApiOperation({ summary: "PDF 메타(언어·제목) 수정" })
  async update(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateManualPdfDto,
  ): Promise<ManualPdfResponseDto> {
    const updated = await this.pdfs.update(user, id, dto);
    return ManualPdfResponseDto.from(updated);
  }

  @Delete("manual-pdfs/:id")
  @CompanyRoles(CompanyRole.OWNER, CompanyRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "PDF 삭제 — 파일도 함께" })
  async remove(@CurrentUser() user: User, @Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.pdfs.remove(user, id);
  }
}
