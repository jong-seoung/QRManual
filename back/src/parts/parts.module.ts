import { Module } from "@nestjs/common";

import { ManualsModule } from "@/manuals/manuals.module";

import { PartsController } from "./parts.controller";
import { PartsService } from "./parts.service";

@Module({
  imports: [ManualsModule],
  controllers: [PartsController],
  providers: [PartsService],
  exports: [PartsService],
})
export class PartsModule {}
