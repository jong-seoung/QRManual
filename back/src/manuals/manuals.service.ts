import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, desc, eq, ilike, sql, type SQL } from "drizzle-orm";

import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { type Manual, manuals, type NewManual } from "@/db/schema/manuals";
import { SystemRole, type User } from "@/db/schema/users";

interface ListOpts {
  page: number;
  size: number;
  keyword?: string;
  companyId?: number;
}

interface ListResult {
  items: Manual[];
  total: number;
  page: number;
  size: number;
}

@Injectable()
export class ManualsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async list(opts: ListOpts): Promise<ListResult> {
    const filters: SQL[] = [eq(manuals.deleted, false)];
    if (opts.companyId) filters.push(eq(manuals.companyId, opts.companyId));
    if (opts.keyword?.trim()) filters.push(ilike(manuals.name, `%${opts.keyword.trim()}%`));

    const where = filters.length === 1 ? filters[0] : and(...filters);
    const offset = opts.page * opts.size;

    const [items, totalRow] = await Promise.all([
      this.db
        .select()
        .from(manuals)
        .where(where)
        .orderBy(desc(manuals.createdAt))
        .limit(opts.size)
        .offset(offset),
      this.db.select({ count: sql<number>`count(*)::int` }).from(manuals).where(where),
    ]);

    return { items, total: totalRow[0]?.count ?? 0, page: opts.page, size: opts.size };
  }

  async findById(id: number, opts: { includeDeleted?: boolean } = {}): Promise<Manual> {
    const where = opts.includeDeleted
      ? eq(manuals.id, id)
      : and(eq(manuals.id, id), eq(manuals.deleted, false));
    const m = await this.db.query.manuals.findFirst({ where });
    if (!m) throw new NotFoundException("Manual not found");
    return m;
  }

  async create(actor: User, data: Omit<NewManual, "companyId">): Promise<Manual> {
    if (!actor.companyId) throw new ForbiddenException("회사 멤버만 매뉴얼 생성 가능");
    const [created] = await this.db
      .insert(manuals)
      .values({ ...data, companyId: actor.companyId })
      .returning();
    return created;
  }

  async update(actor: User, id: number, patch: Partial<NewManual>): Promise<Manual> {
    const m = await this.findById(id);
    this.assertOwnership(actor, m);

    const [updated] = await this.db
      .update(manuals)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(manuals.id, id))
      .returning();
    return updated;
  }

  async softDelete(actor: User, id: number): Promise<void> {
    const m = await this.findById(id);
    this.assertOwnership(actor, m);

    await this.db
      .update(manuals)
      .set({ deleted: true, updatedAt: new Date() })
      .where(eq(manuals.id, id));
  }

  // 부속 모듈(ManualPdfs/Parts/FAQ/CS)에서 재사용 — 매뉴얼 존재 + 회사 권한 체크.
  async assertCanModify(actor: User, manualId: number): Promise<Manual> {
    const m = await this.findById(manualId);
    this.assertOwnership(actor, m);
    return m;
  }

  // SUPER는 모든 회사 통과. 그 외엔 같은 company_id만.
  private assertOwnership(actor: User, m: Manual): void {
    if (actor.systemRole === SystemRole.SUPER) return;
    if (actor.companyId !== m.companyId) {
      throw new ForbiddenException("다른 회사의 매뉴얼은 수정·삭제할 수 없습니다");
    }
  }
}
