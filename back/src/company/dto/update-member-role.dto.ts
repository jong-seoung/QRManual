import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

import { CompanyRole } from "@/db/schema/users";

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: [CompanyRole.OWNER, CompanyRole.ADMIN, CompanyRole.USER] })
  @IsIn([CompanyRole.OWNER, CompanyRole.ADMIN, CompanyRole.USER])
  role!: CompanyRole;
}
