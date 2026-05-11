import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

// 루트 .env 우선 (workspace 모드), 없으면 back/.env로 폴백
loadEnv({ path: "../.env" });
loadEnv({ path: ".env" });

export default defineConfig({
  schema: "./src/db/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USERNAME ?? "qrmanual",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "qrmanual",
    ssl: false,
  },
  casing: "snake_case",
});
