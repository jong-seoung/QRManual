import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import type { Faq } from "@/db/schema/manual-extras";

export class CreateFaqDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  question!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  answer!: string;
}

export class UpdateFaqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  question?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  answer?: string;
}

export class FaqResponseDto {
  @ApiProperty() id!: number;
  @ApiProperty() manualId!: number;
  @ApiProperty() question!: string;
  @ApiProperty() answer!: string;

  static from(f: Faq): FaqResponseDto {
    return { id: f.id, manualId: f.manualId, question: f.question, answer: f.answer };
  }
}
