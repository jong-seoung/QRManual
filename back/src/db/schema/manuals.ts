import { bigint, bigserial, boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { companies } from "./companies";

// manuals — 사용설명서의 부모 엔티티.
// 한 manual = 하나의 제품/장비/소프트웨어를 위한 설명서 묶음.
// 그 아래 여러 PDF(언어별 등)가 manual_pdfs에 붙음.
export const manuals = pgTable("manuals", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  companyId: bigint("company_id", { mode: "number" })
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),

  name: varchar("name").notNull(),
  imageUrl: text("image_url"),
  modelCode: varchar("model_code"),
  releaseYear: integer("release_year"),
  serialNumberLocation: varchar("serial_number_location"),
  productPage: text("product_page"),
  publicStoreLink: text("public_store_link"),

  deleted: boolean("deleted").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Manual = typeof manuals.$inferSelect;
export type NewManual = typeof manuals.$inferInsert;
