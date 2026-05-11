import { bigint, bigserial, boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { companies } from "./companies";

// users — 권한 모델 변경됨 (memory: permission_model)
// - system_role: 'SUPER' | null  (시스템 횡단)
// - company_id + company_role: 회사 단위 소속·역할 (한 사용자 = 한 회사)
export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  username: varchar("username").notNull().unique(),
  email: varchar("email").unique(),
  fullName: varchar("full_name"),
  password: varchar("password").notNull(),
  profileImageUrl: text("profile_image_url"),
  address: varchar("address"),
  enabled: boolean("enabled").notNull().default(false),

  // 권한
  systemRole: varchar("system_role"), // 'SUPER' | null
  companyId: bigint("company_id", { mode: "number" }).references(() => companies.id, {
    onDelete: "set null",
  }),
  companyRole: varchar("company_role"), // 'OWNER' | 'ADMIN' | 'USER' | null

  provider: varchar("provider"), // "LOCAL" | "GOOGLE" | "GITHUB"
  providerId: varchar("provider_id"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const AuthProvider = {
  LOCAL: "LOCAL",
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
} as const;
export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];

export const SystemRole = {
  SUPER: "SUPER",
} as const;
export type SystemRole = (typeof SystemRole)[keyof typeof SystemRole];

export const CompanyRole = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  USER: "USER",
} as const;
export type CompanyRole = (typeof CompanyRole)[keyof typeof CompanyRole];
