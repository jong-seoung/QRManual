import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import type { User } from "@/db/schema/users";

export class MemberResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  username!: string;

  @ApiPropertyOptional({ nullable: true })
  email!: string | null;

  @ApiPropertyOptional({ nullable: true })
  fullName!: string | null;

  @ApiProperty()
  companyRole!: string;

  @ApiProperty()
  enabled!: boolean;

  static from(user: User): MemberResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email ?? null,
      fullName: user.fullName ?? null,
      companyRole: user.companyRole ?? "",
      enabled: user.enabled,
    };
  }
}
