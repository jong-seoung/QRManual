import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

import type { Manual } from "@/db/schema/manuals";

export class CreateManualDto {
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
  @IsString()
  @MaxLength(128)
  modelCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  releaseYear?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  serialNumberLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  productPage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  publicStoreLink?: string;
}

export class UpdateManualDto {
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
  @IsString()
  @MaxLength(128)
  modelCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  releaseYear?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  serialNumberLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  productPage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  publicStoreLink?: string;
}

export class ManualResponseDto {
  @ApiProperty() id!: number;
  @ApiProperty() companyId!: number;
  @ApiProperty() name!: string;
  @ApiPropertyOptional({ nullable: true }) imageUrl!: string | null;
  @ApiPropertyOptional({ nullable: true }) modelCode!: string | null;
  @ApiPropertyOptional({ nullable: true }) releaseYear!: number | null;
  @ApiPropertyOptional({ nullable: true }) serialNumberLocation!: string | null;
  @ApiPropertyOptional({ nullable: true }) productPage!: string | null;
  @ApiPropertyOptional({ nullable: true }) publicStoreLink!: string | null;
  @ApiProperty() createdAt!: Date;

  static from(m: Manual): ManualResponseDto {
    return {
      id: m.id,
      companyId: m.companyId,
      name: m.name,
      imageUrl: m.imageUrl ?? null,
      modelCode: m.modelCode ?? null,
      releaseYear: m.releaseYear ?? null,
      serialNumberLocation: m.serialNumberLocation ?? null,
      productPage: m.productPage ?? null,
      publicStoreLink: m.publicStoreLink ?? null,
      createdAt: m.createdAt,
    };
  }
}

export class ListManualsQueryDto {
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  companyId?: number;
}
