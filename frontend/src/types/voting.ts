export type CandidateType = {
  id: string;
  name: string;
  teamId: string | null;
  teamName?: string;
  teamColor?: string;
  voteCount: number;
};

export type VoteType = {
  id: string;
  candidateId: string;
  createdAt: string;
};

export type VoteLeaderboardCandidate = {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  teamColor: string;
  teamDisplayOrder: number;
  voteCount: number;
};

export type VoteLeaderboardData = {
  candidates: VoteLeaderboardCandidate[];
  totalVotes: number;
};
