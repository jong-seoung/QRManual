import { bigint, bigserial, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { companies } from "./companies";
import { users } from "./users";

// invitations — Owner/Admin이 ADMIN 또는 USER 초대.
// code는 URL에 노출되므로 uuid로 추측 방지.
export const invitations = pgTable("invitations", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  companyId: bigint("company_id", { mode: "number" })
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  email: varchar("email").notNull(),
  role: varchar("role").notNull(), // 'ADMIN' | 'USER'
  code: uuid("code").notNull().defaultRandom().unique(),
  invitedById: bigint("invited_by_id", { mode: "number" })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
