import type { AwardType } from '~/types/award';

export type TeamRanking = {
  rank: number;
  team: { id: string; name: string; concept: string; color: string };
  judgeAvg: number;
  btcScore: number;
  totalScore: number;
};

export type LeaderboardData = {
  rankings: TeamRanking[];
  awards: AwardType[];
};
