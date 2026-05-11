import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, ValidateIf } from "class-validator";

export class LoginDto {
  @ApiPropertyOptional({ description: "email 또는 username 중 하나 필수" })
  @ValidateIf((o: LoginDto) => !o.username)
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @ValidateIf((o: LoginDto) => !o.email)
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsString()
  password!: string;
}
