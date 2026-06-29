import { and, eq, like, or } from 'drizzle-orm';

import { db } from '~/configs/db';
import { teams, users } from '~/db/schema';

type FindAllFilter = {
  role?: string;
  teamId?: string;
  search?: string;
};

class UserRepository {
  findByEmail = async (email: string) => {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user ?? null;
  };

  findById = async (id: string) => {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        teamId: users.teamId,
        isFirstLogin: users.isFirstLogin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id));
    return user ?? null;
  };

  findAll = async (filter: FindAllFilter = {}) => {
    const conditions = [];
    if (filter.role) {
      conditions.push(eq(users.role, filter.role as 'ADMIN' | 'BTC_FSTYLE' | 'MC' | 'MEMBER'));
    }
    if (filter.teamId) {
      conditions.push(eq(users.teamId, filter.teamId));
    }
    if (filter.search) {
      conditions.push(
        or(
          like(users.name, `%${filter.search}%`),
          like(users.email, `%${filter.search}%`),
        ),
      );
    }

    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        teamId: users.teamId,
        teamName: teams.name,
        isFirstLogin: users.isFirstLogin,
        rawPassword: users.rawPassword,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .leftJoin(teams, eq(users.teamId, teams.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(users.createdAt);
  };

  findAllTeams = async () => {
    return await db
      .select({ id: teams.id, name: teams.name })
      .from(teams)
      .orderBy(teams.displayOrder);
  };

  create = async (data: {
    name: string;
    email: string;
    password: string;
    rawPassword: string;
    role: 'ADMIN' | 'BTC_FSTYLE' | 'MC' | 'MEMBER';
    teamId: string | null;
  }) => {
    const id = crypto.randomUUID();
    await db.insert(users).values({ ...data, id, isFirstLogin: 1 });
    return id;
  };

  update = async (
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: 'ADMIN' | 'BTC_FSTYLE' | 'MC' | 'MEMBER';
      teamId?: string | null;
    },
  ) => {
    await db.update(users).set(data).where(eq(users.id, id));
  };

  deleteById = async (id: string) => {
    await db.delete(users).where(eq(users.id, id));
  };

  resetPassword = async (id: string, password: string, rawPassword: string) => {
    await db.update(users).set({ password, rawPassword, isFirstLogin: 1 }).where(eq(users.id, id));
  };

  updateFirstLoginAndPassword = async (id: string, password: string) => {
    await db.update(users).set({ password, isFirstLogin: 0 }).where(eq(users.id, id));
  };

  updatePassword = async (id: string, password: string) => {
    await db.update(users).set({ password }).where(eq(users.id, id));
  };
}

export default new UserRepository();
