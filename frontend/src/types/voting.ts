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
