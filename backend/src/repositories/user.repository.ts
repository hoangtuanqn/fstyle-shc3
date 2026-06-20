import { eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { users } from '~/db/schema';

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
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id));
    return user ?? null;
  };

  updatePassword = async (id: string, password: string) => {
    await db.update(users).set({ password }).where(eq(users.id, id));
  };
}

export default new UserRepository();
