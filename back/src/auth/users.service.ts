import { Inject, Injectable } from "@nestjs/common";
import { eq, or } from "drizzle-orm";

import { DRIZZLE, type DrizzleDb } from "@/db/db.module";
import { type NewUser, type User, users } from "@/db/schema/users";

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  findByUsername(username: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({ where: eq(users.username, username) });
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({ where: eq(users.email, email) });
  }

  findByLoginId(loginId: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: or(eq(users.email, loginId), eq(users.username, loginId)),
    });
  }

  findById(id: number): Promise<User | undefined> {
    return this.db.query.users.findFirst({ where: eq(users.id, id) });
  }

  findByProvider(provider: string, providerId: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: (u, { and, eq }) => and(eq(u.provider, provider), eq(u.providerId, providerId)),
    });
  }

  async existsByUsername(username: string): Promise<boolean> {
    const found = await this.findByUsername(username);
    return Boolean(found);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const found = await this.findByEmail(email);
    return Boolean(found);
  }

  async create(data: NewUser): Promise<User> {
    const [created] = await this.db.insert(users).values(data).returning();
    return created;
  }

  async update(id: number, data: Partial<NewUser>): Promise<User> {
    const [updated] = await this.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async setEnabled(id: number, enabled: boolean): Promise<User> {
    return this.update(id, { enabled });
  }

  async setPassword(id: number, hashedPassword: string): Promise<User> {
    return this.update(id, { password: hashedPassword });
  }
}
