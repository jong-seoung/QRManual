import { bigint, bigserial, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { manuals } from "./manuals";

// manual_pdfs — 한 매뉴얼에 첨부된 실제 PDF 파일들 (옛 'manuals' 테이블에서 재이름).
// 한 매뉴얼에 여러 PDF (언어별, 또는 동일 언어 다른 종류) 가능.
export const manualPdfs = pgTable("manual_pdfs", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  manualId: bigint("manual_id", { mode: "number" })
    .notNull()
    .references(() => manuals.id, { onDelete: "cascade" }),

  language: varchar("language").notNull(),
  title: varchar("title"),
  pdfUrl: text("pdf_url").notNull(),
  storageKey: text("storage_key").notNull(),
  originFileName: varchar("origin_file_name"),
  mimeType: varchar("mime_type"),
  fileSize: integer("file_size"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ManualPdf = typeof manualPdfs.$inferSelect;
export type NewManualPdf = typeof manualPdfs.$inferInsert;
