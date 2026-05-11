import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { LocalStorage } from "./local.storage";
import { S3Storage } from "./s3.storage";
import { STORAGE, type StorageDriver } from "./storage.types";

// STORAGE_DRIVER 환경변수로 분기.
// - 명시값: 'local' | 's3'
// - 미지정: NODE_ENV=production → s3, else → local
function pickDriver(config: ConfigService): "local" | "s3" {
  const explicit = config.get<string>("STORAGE_DRIVER");
  if (explicit === "local" || explicit === "s3") return explicit;
  return config.get("NODE_ENV") === "production" ? "s3" : "local";
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: STORAGE,
      inject: [ConfigService],
      useFactory: (config: ConfigService): StorageDriver => {
        const driver = pickDriver(config);
        return driver === "s3" ? new S3Storage(config) : new LocalStorage(config);
      },
    },
  ],
  exports: [STORAGE],
})
export class StorageModule {}
