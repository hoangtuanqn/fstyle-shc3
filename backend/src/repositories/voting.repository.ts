import { and, eq, sql } from 'drizzle-orm';

import { db } from '~/configs/db';
import { RoleType } from '~/constants/enums';
import { effortVotes, teams, users } from '~/db/schema';

class VotingRepository {
  findVotesByVoter = async (voterId: string) => {
    return await db
      .select({
        id: effortVotes.id,
        candidateId: effortVotes.candidateId,
        createdAt: effortVotes.createdAt,
      })
      .from(effortVotes)
      .where(eq(effortVotes.voterId, voterId));
  };

  findVotesByVoterAndTeam = async (voterId: string, teamId: string) => {
    return await db
      .select({ candidateId: effortVotes.candidateId })
      .from(effortVotes)
      .innerJoin(users, eq(users.id, effortVotes.candidateId))
      .where(and(eq(effortVotes.voterId, voterId), eq(users.teamId, teamId)));
  };

  findCandidatesByTeam = async (teamId: string) => {
    return await db
      .select({
        id: users.id,
        name: users.name,
        teamId: users.teamId,
        voteCount: sql<number>`(SELECT COUNT(*) FROM effort_votes WHERE candidate_id = ${users.id})`,
      })
      .from(users)
      .where(and(eq(users.teamId, teamId), eq(users.role, RoleType.MEMBER)));
  };

  findAllCandidatesGrouped = async () => {
    return await db
      .select({
        id: users.id,
        name: users.name,
        teamId: users.teamId,
        teamName: teams.name,
        teamColor: teams.color,
        voteCount: sql<number>`(SELECT COUNT(*) FROM effort_votes WHERE candidate_id = ${users.id})`,
      })
      .from(users)
      .innerJoin(teams, eq(users.teamId, teams.id))
      .where(eq(users.role, RoleType.MEMBER))
      .orderBy(teams.displayOrder);
  };

  findVoteByVoterAndCandidate = async (voterId: string, candidateId: string) => {
    const [row] = await db
      .select({ id: effortVotes.id })
      .from(effortVotes)
      .where(and(eq(effortVotes.voterId, voterId), eq(effortVotes.candidateId, candidateId)));
    return row ?? null;
  };

  createVote = async (voterId: string, candidateId: string) => {
    await db.insert(effortVotes).values({ voterId, candidateId });
  };

  deleteVote = async (voterId: string, candidateId: string) => {
    await db
      .delete(effortVotes)
      .where(and(eq(effortVotes.voterId, voterId), eq(effortVotes.candidateId, candidateId)));
  };
}

export default new VotingRepository();
