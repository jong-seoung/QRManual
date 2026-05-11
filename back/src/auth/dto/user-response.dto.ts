import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import type { User } from "@/db/schema/users";

export class UserResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  username!: string;

  @ApiPropertyOptional({ nullable: true })
  email!: string | null;

  @ApiPropertyOptional({ nullable: true })
  fullName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  profileImageUrl!: string | null;

  @ApiPropertyOptional({ nullable: true })
  address!: string | null;

  @ApiProperty()
  enabled!: boolean;

  @ApiPropertyOptional({ nullable: true })
  systemRole!: string | null;

  @ApiPropertyOptional({ nullable: true })
  companyId!: number | null;

  @ApiPropertyOptional({ nullable: true })
  companyRole!: string | null;

  @ApiPropertyOptional({ nullable: true })
  provider!: string | null;

  static from(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email ?? null,
      fullName: user.fullName ?? null,
      profileImageUrl: user.profileImageUrl ?? null,
      address: user.address ?? null,
      enabled: user.enabled,
      systemRole: user.systemRole ?? null,
      companyId: user.companyId ?? null,
      companyRole: user.companyRole ?? null,
      provider: user.provider ?? null,
    };
  }
}
