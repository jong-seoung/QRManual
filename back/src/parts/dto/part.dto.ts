import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

import type { Part } from "@/db/schema/manual-extras";

export class CreatePartDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  storeLink?: string;
}

export class UpdatePartDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  storeLink?: string;
}

export class PartResponseDto {
  @ApiProperty() id!: number;
  @ApiProperty() manualId!: number;
  @ApiProperty() name!: string;
  @ApiPropertyOptional({ nullable: true }) imageUrl!: string | null;
  @ApiPropertyOptional({ nullable: true }) storeLink!: string | null;

  static from(p: Part): PartResponseDto {
    return {
      id: p.id,
      manualId: p.manualId,
      name: p.name,
      imageUrl: p.imageUrl ?? null,
      storeLink: p.storeLink ?? null,
    };
  }
}
