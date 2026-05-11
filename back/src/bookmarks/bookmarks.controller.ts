import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import type { User } from "@/db/schema/users";
import { ManualPdfResponseDto } from "@/manual-pdfs/dto/manual-pdf.dto";
import { ManualResponseDto } from "@/manuals/dto/manual.dto";

import { BookmarksService } from "./bookmarks.service";

interface BookmarkedManualPdfDto {
  pdf: ManualPdfResponseDto;
  manual: ManualResponseDto;
  company: { id: number; name: string; officialMark: boolean };
}

@ApiTags("bookmarks")
@Controller("api")
export class BookmarksController {
  constructor(private readonly bookmarks: BookmarksService) {}

  @Get("me/bookmarks")
  @ApiOperation({ summary: "내가 저장한 PDF 목록 (매뉴얼·회사 컨텍스트 포함)" })
  async listMine(@CurrentUser() user: User): Promise<BookmarkedManualPdfDto[]> {
    const items = await this.bookmarks.listMine(user);
    return items.map((it) => ({
      pdf: ManualPdfResponseDto.from(it.pdf),
      manual: ManualResponseDto.from(it.manual),
      company: it.company,
    }));
  }

  @Get("manual-pdfs/:manualPdfId/bookmark/me")
  @ApiOperation({ summary: "내가 이 PDF를 저장했는지" })
  async isMine(
    @CurrentUser() user: User,
    @Param("manualPdfId", ParseIntPipe) manualPdfId: number,
  ): Promise<{ bookmarked: boolean }> {
    return { bookmarked: await this.bookmarks.isBookmarked(user, manualPdfId) };
  }

  @Post("manual-pdfs/:manualPdfId/bookmark")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "PDF 저장 (멱등)" })
  async add(
    @CurrentUser() user: User,
    @Param("manualPdfId", ParseIntPipe) manualPdfId: number,
  ): Promise<void> {
    await this.bookmarks.add(user, manualPdfId);
  }

  @Delete("manual-pdfs/:manualPdfId/bookmark")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "PDF 저장 해제" })
  async remove(
    @CurrentUser() user: User,
    @Param("manualPdfId", ParseIntPipe) manualPdfId: number,
  ): Promise<void> {
    await this.bookmarks.remove(user, manualPdfId);
  }
}
