import { bigserial, boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

// companies — 옛 company_info 대체.
// owner는 users.company_role='OWNER'로 유추 (별도 owner_id 안 둠 — 순환 FK 방지).
export const companies = pgTable("companies", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique(), // URL 용 (지금은 옵션, 추후 /c/<slug>에서 사용 가능)
  officialMark: boolean("official_mark").notNull().default(false),
  homePage: varchar("home_page"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
