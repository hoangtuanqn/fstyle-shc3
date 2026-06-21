import { eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { awards, awardWinners, teams } from '~/db/schema';

type AwardWinnerInput = {
  awardId: string;
  slot: number;
  winnerTeamId?: string | null;
  winnerUserId?: string | null;
  winnerName?: string | null;
};

class AwardRepository {
  findAll = async () => {
    const allAwards = await db.select().from(awards).orderBy(awards.displayOrder);
    const allWinners = await db.select().from(awardWinners).orderBy(awardWinners.slot);

    return allAwards.map((award) => ({
      ...award,
      winners: allWinners.filter((w) => w.awardId === award.id),
    }));
  };

  findById = async (id: string) => {
    const [award] = await db.select().from(awards).where(eq(awards.id, id));
    if (!award) return null;

    const winners = await db
      .select()
      .from(awardWinners)
      .where(eq(awardWinners.awardId, id))
      .orderBy(awardWinners.slot);

    return { ...award, winners };
  };

  deleteWinnersByAwardId = async (awardId: string) => {
    await db.delete(awardWinners).where(eq(awardWinners.awardId, awardId));
  };

  insertWinners = async (rows: AwardWinnerInput[]) => {
    if (rows.length === 0) return;
    await db.insert(awardWinners).values(rows);
  };

  findTeamById = async (teamId: string) => {
    const [result] = await db.select().from(teams).where(eq(teams.id, teamId));
    return result ?? null;
  };
}

export default new AwardRepository();
