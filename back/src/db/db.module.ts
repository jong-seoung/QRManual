import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export const DRIZZLE = Symbol("DRIZZLE");
export type DrizzleDb = NodePgDatabase<typeof schema>;

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (config: ConfigService): DrizzleDb => {
        const pool = new Pool({
          host: config.getOrThrow("DB_HOST"),
          port: Number(config.get("DB_PORT") ?? 5432),
          user: config.getOrThrow("DB_USERNAME"),
          password: config.getOrThrow("DB_PASSWORD"),
          database: config.getOrThrow("DB_NAME"),
          max: 10,
        });
        return drizzle(pool, { schema, casing: "snake_case" });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
