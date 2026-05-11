import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import type { Company } from "@/db/schema/companies";

export class CompanyResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  slug!: string | null;

  @ApiProperty()
  officialMark!: boolean;

  @ApiPropertyOptional({ nullable: true })
  homePage!: string | null;

  static from(company: Company): CompanyResponseDto {
    return {
      id: company.id,
      name: company.name,
      slug: company.slug ?? null,
      officialMark: company.officialMark,
      homePage: company.homePage ?? null,
    };
  }
}
