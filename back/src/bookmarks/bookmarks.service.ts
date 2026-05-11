import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, desc, eq } from "drizzle-orm";

import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { manualPdfBookmarks } from "@/db/schema/bookmarks";
import { type Company, companies } from "@/db/schema/companies";
import { type ManualPdf, manualPdfs } from "@/db/schema/manual-pdfs";
import { type Manual, manuals } from "@/db/schema/manuals";
import type { User } from "@/db/schema/users";

export interface BookmarkedManualPdf {
  pdf: ManualPdf;
  manual: Manual;
  company: Pick<Company, "id" | "name" | "officialMark">;
}

@Injectable()
export class BookmarksService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async isBookmarked(user: User, manualPdfId: number): Promise<boolean> {
    const found = await this.db.query.manualPdfBookmarks.findFirst({
      where: and(eq(manualPdfBookmarks.userId, user.id), eq(manualPdfBookmarks.manualPdfId, manualPdfId)),
    });
    return Boolean(found);
  }

  async add(user: User, manualPdfId: number): Promise<void> {
    await this.assertPdfExists(manualPdfId);
    if (await this.isBookmarked(user, manualPdfId)) return;
    await this.db.insert(manualPdfBookmarks).values({ userId: user.id, manualPdfId });
  }

  async remove(user: User, manualPdfId: number): Promise<void> {
    await this.db
      .delete(manualPdfBookmarks)
      .where(
        and(eq(manualPdfBookmarks.userId, user.id), eq(manualPdfBookmarks.manualPdfId, manualPdfId)),
      );
  }

  // PDF + 매뉴얼 + 회사 정보 조인. 삭제된 매뉴얼은 제외.
  async listMine(user: User): Promise<BookmarkedManualPdf[]> {
    const rows = await this.db
      .select({ pdf: manualPdfs, manual: manuals, company: companies })
      .from(manualPdfBookmarks)
      .innerJoin(manualPdfs, eq(manualPdfBookmarks.manualPdfId, manualPdfs.id))
      .innerJoin(manuals, eq(manualPdfs.manualId, manuals.id))
      .innerJoin(companies, eq(manuals.companyId, companies.id))
      .where(and(eq(manualPdfBookmarks.userId, user.id), eq(manuals.deleted, false)))
      .orderBy(desc(manualPdfBookmarks.createdAt));

    return rows.map((r) => ({
      pdf: r.pdf,
      manual: r.manual,
      company: { id: r.company.id, name: r.company.name, officialMark: r.company.officialMark },
    }));
  }

  private async assertPdfExists(manualPdfId: number): Promise<void> {
    const pdf = await this.db.query.manualPdfs.findFirst({
      where: eq(manualPdfs.id, manualPdfId),
    });
    if (!pdf) throw new NotFoundException("Manual PDF not found");
  }
}
