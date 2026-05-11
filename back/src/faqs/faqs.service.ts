import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";

import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { type Faq, faqs, type NewFaq } from "@/db/schema/manual-extras";
import type { User } from "@/db/schema/users";
import { ManualsService } from "@/manuals/manuals.service";

@Injectable()
export class FaqsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
    private readonly manuals: ManualsService,
  ) {}

  listByManual(manualId: number): Promise<Faq[]> {
    return this.db.query.faqs.findMany({
      where: eq(faqs.manualId, manualId),
      orderBy: [desc(faqs.createdAt)],
    });
  }

  async findById(id: number): Promise<Faq> {
    const faq = await this.db.query.faqs.findFirst({ where: eq(faqs.id, id) });
    if (!faq) throw new NotFoundException("FAQ not found");
    return faq;
  }

  async create(actor: User, manualId: number, data: Omit<NewFaq, "manualId">): Promise<Faq> {
    await this.manuals.assertCanModify(actor, manualId);
    const [created] = await this.db.insert(faqs).values({ ...data, manualId }).returning();
    return created;
  }

  async update(actor: User, id: number, patch: Partial<NewFaq>): Promise<Faq> {
    const faq = await this.findById(id);
    await this.manuals.assertCanModify(actor, faq.manualId);
    const [updated] = await this.db
      .update(faqs)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(faqs.id, id))
      .returning();
    return updated;
  }

  async remove(actor: User, id: number): Promise<void> {
    const faq = await this.findById(id);
    await this.manuals.assertCanModify(actor, faq.manualId);
    await this.db.delete(faqs).where(eq(faqs.id, id));
  }
}
