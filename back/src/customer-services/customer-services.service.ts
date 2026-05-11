import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { type CustomerService, customerServices, type NewCustomerService } from "@/db/schema/manual-extras";
import type { User } from "@/db/schema/users";
import { ManualsService } from "@/manuals/manuals.service";

@Injectable()
export class CustomerServicesService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
    private readonly manuals: ManualsService,
  ) {}

  findByManual(manualId: number): Promise<CustomerService | undefined> {
    return this.db.query.customerServices.findFirst({
      where: eq(customerServices.manualId, manualId),
    });
  }

  // 1:1 upsert — 이미 있으면 업데이트, 없으면 생성.
  async upsert(
    actor: User,
    manualId: number,
    data: Omit<NewCustomerService, "manualId">,
  ): Promise<CustomerService> {
    await this.manuals.assertCanModify(actor, manualId);

    const existing = await this.findByManual(manualId);
    if (existing) {
      const [updated] = await this.db
        .update(customerServices)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(customerServices.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await this.db
      .insert(customerServices)
      .values({ ...data, manualId })
      .returning();
    return created;
  }

  async remove(actor: User, manualId: number): Promise<void> {
    await this.manuals.assertCanModify(actor, manualId);
    await this.db.delete(customerServices).where(eq(customerServices.manualId, manualId));
  }
}
