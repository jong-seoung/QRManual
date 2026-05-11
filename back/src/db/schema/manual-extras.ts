import { bigint, bigserial, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

import { manuals } from "./manuals";

// 매뉴얼 부속 정보 — Parts/Faq/CustomerService 매핑.
// Parts·FAQ는 N:1, CustomerService는 1:1 (manual_id UNIQUE).

export const parts = pgTable("parts", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  manualId: bigint("manual_id", { mode: "number" })
    .notNull()
    .references(() => manuals.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  imageUrl: text("image_url"),
  storeLink: text("store_link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  manualId: bigint("manual_id", { mode: "number" })
    .notNull()
    .references(() => manuals.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const customerServices = pgTable(
  "customer_services",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    manualId: bigint("manual_id", { mode: "number" })
      .notNull()
      .references(() => manuals.id, { onDelete: "cascade" }),
    phone: varchar("phone"),
    email: varchar("email"),
    operationTime: varchar("operation_time"),
    chatLink: text("chat_link"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    manualUnique: uniqueIndex("customer_services_manual_idx").on(t.manualId),
  }),
);

export type Part = typeof parts.$inferSelect;
export type NewPart = typeof parts.$inferInsert;
export type Faq = typeof faqs.$inferSelect;
export type NewFaq = typeof faqs.$inferInsert;
export type CustomerService = typeof customerServices.$inferSelect;
export type NewCustomerService = typeof customerServices.$inferInsert;
