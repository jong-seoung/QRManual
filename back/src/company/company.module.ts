import { Module } from "@nestjs/common";

import { AuthModule } from "@/auth/auth.module";
import { MailService } from "@/auth/mail.service";

import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { InvitationsController, PublicInvitationController } from "./invitations.controller";
import { InvitationsService } from "./invitations.service";
import { MembersController } from "./members.controller";
import { MembersService } from "./members.service";

@Module({
  imports: [AuthModule.register()], // UsersService, TokenService 등은 Auth가 export
  controllers: [
    CompanyController,
    MembersController,
    InvitationsController,
    PublicInvitationController,
  ],
  providers: [CompanyService, MembersService, InvitationsService, MailService],
  exports: [CompanyService],
})
export class CompanyModule {}
