import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import type { ManualPdf } from "@/db/schema/manual-pdfs";

export class CreateManualPdfDto {
  @ApiProperty({ description: "예: 'ko', 'en'" })
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  language!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
}

export class UpdateManualPdfDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
}

export class ManualPdfResponseDto {
  @ApiProperty() id!: number;
  @ApiProperty() manualId!: number;
  @ApiProperty() language!: string;
  @ApiPropertyOptional({ nullable: true }) title!: string | null;
  @ApiProperty() pdfUrl!: string;
  @ApiPropertyOptional({ nullable: true }) originFileName!: string | null;
  @ApiPropertyOptional({ nullable: true }) mimeType!: string | null;
  @ApiPropertyOptional({ nullable: true }) fileSize!: number | null;
  @ApiProperty() createdAt!: Date;

  static from(p: ManualPdf): ManualPdfResponseDto {
    return {
      id: p.id,
      manualId: p.manualId,
      language: p.language,
      title: p.title ?? null,
      pdfUrl: p.pdfUrl,
      originFileName: p.originFileName ?? null,
      mimeType: p.mimeType ?? null,
      fileSize: p.fileSize ?? null,
      createdAt: p.createdAt,
    };
  }
}
