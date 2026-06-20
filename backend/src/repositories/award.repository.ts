import { eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { awards, teams } from '~/db/schema';

class AwardRepository {
  findAll = async () => {
    return await db.select().from(awards).orderBy(awards.displayOrder);
  };

  findById = async (id: string) => {
    const [result] = await db.select().from(awards).where(eq(awards.id, id));
    return result ?? null;
  };

  updateWinner = async (
    id: string,
    data: { winnerTeamId?: string | null; winnerUserId?: string | null; winnerName?: string | null },
  ) => {
    await db.update(awards).set(data).where(eq(awards.id, id));
  };

  findTeamById = async (teamId: string) => {
    const [result] = await db.select().from(teams).where(eq(teams.id, teamId));
    return result ?? null;
  };
}

export default new AwardRepository();
