import { resolve } from "path";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

import { AuthModule } from "./auth/auth.module";
import { BookmarksModule } from "./bookmarks/bookmarks.module";
import { CompanyModule } from "./company/company.module";
import { RedisModule } from "./common/redis/redis.module";
import { StorageModule } from "./common/storage/storage.module";
import { CustomerServicesModule } from "./customer-services/customer-services.module";
import { DbModule } from "./db/db.module";
import { FaqsModule } from "./faqs/faqs.module";
import { ManualPdfsModule } from "./manual-pdfs/manual-pdfs.module";
import { ManualsModule } from "./manuals/manuals.module";
import { PartsModule } from "./parts/parts.module";
import { UploadsModule } from "./uploads/uploads.module";

const useLocalStatic =
  (process.env.STORAGE_DRIVER ?? (process.env.NODE_ENV === "production" ? "s3" : "local")) === "local";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env", "../.env"] }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    ...(useLocalStatic
      ? [
          ServeStaticModule.forRoot({
            rootPath: resolve(process.env.UPLOAD_DIR || "./uploads"),
            serveRoot: "/uploads",
            serveStaticOptions: { index: false, redirect: false },
          }),
        ]
      : []),
    DbModule,
    RedisModule,
    StorageModule,
    AuthModule.register(),
    CompanyModule,
    ManualsModule,
    ManualPdfsModule,
    BookmarksModule,
    PartsModule,
    FaqsModule,
    CustomerServicesModule,
    UploadsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
