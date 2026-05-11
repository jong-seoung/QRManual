import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";

import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { type NewPart, type Part, parts } from "@/db/schema/manual-extras";
import type { User } from "@/db/schema/users";
import { ManualsService } from "@/manuals/manuals.service";

@Injectable()
export class PartsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
    private readonly manuals: ManualsService,
  ) {}

  listByManual(manualId: number): Promise<Part[]> {
    return this.db.query.parts.findMany({
      where: eq(parts.manualId, manualId),
      orderBy: [desc(parts.createdAt)],
    });
  }

  async findById(id: number): Promise<Part> {
    const part = await this.db.query.parts.findFirst({ where: eq(parts.id, id) });
    if (!part) throw new NotFoundException("Part not found");
    return part;
  }

  async create(actor: User, manualId: number, data: Omit<NewPart, "manualId">): Promise<Part> {
    await this.manuals.assertCanModify(actor, manualId);
    const [created] = await this.db.insert(parts).values({ ...data, manualId }).returning();
    return created;
  }

  async update(actor: User, id: number, patch: Partial<NewPart>): Promise<Part> {
    const part = await this.findById(id);
    await this.manuals.assertCanModify(actor, part.manualId);
    const [updated] = await this.db
      .update(parts)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(parts.id, id))
      .returning();
    return updated;
  }

  async remove(actor: User, id: number): Promise<void> {
    const part = await this.findById(id);
    await this.manuals.assertCanModify(actor, part.manualId);
    await this.db.delete(parts).where(eq(parts.id, id));
  }
}
