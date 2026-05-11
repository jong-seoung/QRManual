import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn } from "class-validator";

import { CompanyRole } from "@/db/schema/users";

export class CreateInvitationDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: [CompanyRole.ADMIN, CompanyRole.USER] })
  @IsIn([CompanyRole.ADMIN, CompanyRole.USER])
  role!: typeof CompanyRole.ADMIN | typeof CompanyRole.USER;
}
