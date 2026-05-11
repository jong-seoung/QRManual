import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

// 공개 가입 — 두 가지 흐름:
// - companyName 비어있음 → 일반(personal) 사용자. company 미배정. 매뉴얼 조회·북마크 등.
// - companyName 채워짐  → 회사 생성 + 가입자가 OWNER.
// Admin/User는 별도 초대 DTO(AcceptInviteDto)로만 가입.
export class RegisterDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  username!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  // ─── 회사 ────────────────────────────────────────────────────────
  @ApiPropertyOptional({ description: "값이 있으면 회사 생성 + 가입자 OWNER. 없으면 일반 사용자." })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(255)
  homePage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  officialMark?: boolean;
}
