import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

// 초대 받은 사람이 가입할 때 사용. 회사·역할은 초대 코드에서 결정됨.
export class AcceptInviteDto {
  @ApiProperty()
  @IsUUID()
  code!: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  username!: string;

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
}
