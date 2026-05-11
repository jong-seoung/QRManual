import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

import type { CustomerService } from "@/db/schema/manual-extras";

// 1:1이라 모든 필드 선택. PUT이 곧 upsert.
export class UpsertCustomerServiceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  operationTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  chatLink?: string;
}

export class CustomerServiceResponseDto {
  @ApiProperty() id!: number;
  @ApiProperty() manualId!: number;
  @ApiPropertyOptional({ nullable: true }) phone!: string | null;
  @ApiPropertyOptional({ nullable: true }) email!: string | null;
  @ApiPropertyOptional({ nullable: true }) operationTime!: string | null;
  @ApiPropertyOptional({ nullable: true }) chatLink!: string | null;

  static from(c: CustomerService): CustomerServiceResponseDto {
    return {
      id: c.id,
      manualId: c.manualId,
      phone: c.phone ?? null,
      email: c.email ?? null,
      operationTime: c.operationTime ?? null,
      chatLink: c.chatLink ?? null,
    };
  }
}
