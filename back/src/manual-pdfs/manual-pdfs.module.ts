import { Module } from "@nestjs/common";

import { ManualsModule } from "@/manuals/manuals.module";

import { ManualPdfsController } from "./manual-pdfs.controller";
import { ManualPdfsService } from "./manual-pdfs.service";

@Module({
  imports: [ManualsModule],
  controllers: [ManualPdfsController],
  providers: [ManualPdfsService],
  exports: [ManualPdfsService],
})
export class ManualPdfsModule {}
