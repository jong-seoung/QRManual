import { Module } from "@nestjs/common";

import { ManualsModule } from "@/manuals/manuals.module";

import { CustomerServicesController } from "./customer-services.controller";
import { CustomerServicesService } from "./customer-services.service";

@Module({
  imports: [ManualsModule],
  controllers: [CustomerServicesController],
  providers: [CustomerServicesService],
  exports: [CustomerServicesService],
})
export class CustomerServicesModule {}
