import { bigint, bigserial, pgTable, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { manualPdfs } from "./manual-pdfs";
import { users } from "./users";

// manual_pdf_bookmarks — 사용자가 특정 PDF(언어별 사용설명서)를 저장.
// (user_id, manual_pdf_id) UNIQUE — 중복 저장 방지.
// 사용자/PDF 삭제 시 cascade.
export const manualPdfBookmarks = pgTable(
  "manual_pdf_bookmarks",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    manualPdfId: bigint("manual_pdf_id", { mode: "number" })
      .notNull()
      .references(() => manualPdfs.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    userPdfUnique: uniqueIndex("manual_pdf_bookmarks_user_pdf_idx").on(t.userId, t.manualPdfId),
  }),
);

export type ManualPdfBookmark = typeof manualPdfBookmarks.$inferSelect;
export type NewManualPdfBookmark = typeof manualPdfBookmarks.$inferInsert;
