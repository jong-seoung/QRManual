import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class UpdateCompanyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  name?: string;

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
