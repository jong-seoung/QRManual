import { Module } from "@nestjs/common";

import { ManualsModule } from "@/manuals/manuals.module";

import { FaqsController } from "./faqs.controller";
import { FaqsService } from "./faqs.service";

@Module({
  imports: [ManualsModule],
  controllers: [FaqsController],
  providers: [FaqsService],
  exports: [FaqsService],
})
export class FaqsModule {}
