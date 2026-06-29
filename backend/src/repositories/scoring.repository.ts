import { and, eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { btcScores, judgeScores, teams } from '~/db/schema';

class ScoringRepository {
  findJudgeScoresByTeam = async (teamId: string) => {
    return await db.select().from(judgeScores).where(eq(judgeScores.teamId, teamId)).orderBy(judgeScores.judgeNumber);
  };

  findBtcScoreByTeam = async (teamId: string) => {
    const [result] = await db.select().from(btcScores).where(eq(btcScores.teamId, teamId));
    return result ?? null;
  };

  upsertJudgeScores = async (
    teamId: string,
    judgeNumber: number,
    scores: {
      ideaConcept: number;
      choreography: number;
      synchronization: number;
      performance: number;
      costume: number;
      subScores?: Record<string, number>;
    },
  ) => {
    const existing = await db
      .select({ id: judgeScores.id })
      .from(judgeScores)
      .where(and(eq(judgeScores.teamId, teamId), eq(judgeScores.judgeNumber, judgeNumber)));

    const payload = {
      ideaConcept: String(scores.ideaConcept),
      choreography: String(scores.choreography),
      synchronization: String(scores.synchronization),
      performance: String(scores.performance),
      costume: String(scores.costume),
      subScores: scores.subScores ?? null,
    };

    if (existing.length > 0) {
      await db.update(judgeScores).set(payload).where(and(eq(judgeScores.teamId, teamId), eq(judgeScores.judgeNumber, judgeNumber)));
    } else {
      await db.insert(judgeScores).values({ teamId, judgeNumber, ...payload });
    }
  };

  upsertBtcScore = async (teamId: string, discipline: number, subScores?: Record<string, number>) => {
    const existing = await db.select({ id: btcScores.id }).from(btcScores).where(eq(btcScores.teamId, teamId));
    const payload = { discipline: String(discipline), subScores: subScores ?? null };
    if (existing.length > 0) {
      await db.update(btcScores).set(payload).where(eq(btcScores.teamId, teamId));
    } else {
      await db.insert(btcScores).values({ teamId, ...payload });
    }
  };

  findAllTeams = async () => {
    return await db.select().from(teams).orderBy(teams.displayOrder);
  };

  findAllJudgeScores = async () => {
    return await db.select().from(judgeScores).orderBy(judgeScores.teamId, judgeScores.judgeNumber);
  };

  findAllBtcScores = async () => {
    return await db.select().from(btcScores);
  };
}

export default new ScoringRepository();
