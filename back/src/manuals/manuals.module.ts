import { Module } from "@nestjs/common";

import { ManualsController } from "./manuals.controller";
import { ManualsService } from "./manuals.service";
import { PublicManualsController } from "./public-manuals.controller";

@Module({
  controllers: [ManualsController, PublicManualsController],
  providers: [ManualsService],
  exports: [ManualsService],
})
export class ManualsModule {}
