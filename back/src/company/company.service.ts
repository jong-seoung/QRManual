import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { type Company, companies, type NewCompany } from "@/db/schema/companies";

@Injectable()
export class CompanyService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async findById(id: number): Promise<Company> {
    const company = await this.db.query.companies.findFirst({ where: eq(companies.id, id) });
    if (!company) throw new NotFoundException("Company not found");
    return company;
  }

  async update(id: number, patch: Partial<NewCompany>): Promise<Company> {
    const [updated] = await this.db
      .update(companies)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    if (!updated) throw new NotFoundException("Company not found");
    return updated;
  }

  // SUPER가 아닌 사용자가 다른 회사를 조작하려 할 때 사용
  ensureSameCompany(userCompanyId: number | null, targetCompanyId: number): void {
    if (userCompanyId !== targetCompanyId) {
      throw new ForbiddenException("cross-company access denied");
    }
  }
}
