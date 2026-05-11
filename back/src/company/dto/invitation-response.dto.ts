import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import type { Invitation } from "@/db/schema/invitations";

export class InvitationResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  role!: string;

  @ApiProperty()
  expiresAt!: Date;

  @ApiPropertyOptional({ nullable: true })
  acceptedAt!: Date | null;

  @ApiProperty()
  createdAt!: Date;

  static from(invite: Invitation): InvitationResponseDto {
    return {
      id: invite.id,
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expiresAt,
      acceptedAt: invite.acceptedAt ?? null,
      createdAt: invite.createdAt,
    };
  }
}

// 수락 페이지에서 미리 회사명 등을 보여주기 위한 응답
export class InvitationPreviewDto {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  role!: string;

  @ApiProperty()
  companyName!: string;
}
