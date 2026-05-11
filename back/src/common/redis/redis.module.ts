import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Redis from "ioredis";

export const REDIS = Symbol("REDIS");

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Redis => {
        return new Redis({
          host: config.getOrThrow("REDIS_HOST"),
          port: Number(config.get("REDIS_PORT") ?? 6379),
          lazyConnect: false,
        });
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
