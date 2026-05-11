import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { CompanyRole, type User, users } from "@/db/schema/users";

@Injectable()
export class MembersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  list(companyId: number): Promise<User[]> {
    return this.db.query.users.findMany({
      where: eq(users.companyId, companyId),
    });
  }

  async findInCompany(companyId: number, memberId: number): Promise<User> {
    const member = await this.db.query.users.findFirst({
      where: and(eq(users.id, memberId), eq(users.companyId, companyId)),
    });
    if (!member) throw new NotFoundException("Member not found");
    return member;
  }

  async setRole(companyId: number, memberId: number, role: CompanyRole): Promise<User> {
    const member = await this.findInCompany(companyId, memberId);

    // OWNER → 비-OWNER로 강등 시 마지막 OWNER 보호
    if (member.companyRole === CompanyRole.OWNER && role !== CompanyRole.OWNER) {
      const ownerCount = await this.countOwners(companyId);
      if (ownerCount <= 1) throw new BadRequestException("최소 한 명의 OWNER가 필요합니다");
    }

    const [updated] = await this.db
      .update(users)
      .set({ companyRole: role, updatedAt: new Date() })
      .where(eq(users.id, memberId))
      .returning();
    return updated;
  }

  async remove(companyId: number, memberId: number): Promise<void> {
    const member = await this.findInCompany(companyId, memberId);
    if (member.companyRole === CompanyRole.OWNER) {
      const ownerCount = await this.countOwners(companyId);
      if (ownerCount <= 1) throw new ConflictException("마지막 OWNER는 제거할 수 없습니다");
    }
    // 회사에서만 분리 — 사용자 자체는 남김 (다시 초대 받을 수 있게)
    await this.db
      .update(users)
      .set({ companyId: null, companyRole: null, updatedAt: new Date() })
      .where(eq(users.id, memberId));
  }

  private async countOwners(companyId: number): Promise<number> {
    const owners = await this.db.query.users.findMany({
      where: and(eq(users.companyId, companyId), eq(users.companyRole, CompanyRole.OWNER)),
    });
    return owners.length;
  }
}
