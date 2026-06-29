export type TeamScoreSummary = {
  id: string;
  name: string;
  concept: string;
  color: string;
  displayOrder: number;
  judgeAvg: number;
  btcScore: number;
  totalScore: number;
};

export type JudgeScoreRow = {
  id: string;
  teamId: string;
  judgeNumber: number;
  ideaConcept: string;
  choreography: string;
  synchronization: string;
  performance: string;
  costume: string;
  subScores?: Record<string, number> | null;
};

export type BtcScoreRow = {
  id: string;
  teamId: string;
  discipline: string;
  subScores?: Record<string, number> | null;
} | null;

export type TeamScoreDetail = {
  judgeScores: JudgeScoreRow[];
  btcScore: BtcScoreRow;
};

export type JudgeScoresInput = {
  judgeNumber: number;
  ideaConcept: number;
  choreography: number;
  synchronization: number;
  performance: number;
  costume: number;
  subScores?: Record<string, number>;
};

export type BtcScoreInput = {
  discipline: number;
  subScores?: Record<string, number>;
};

export type TeamStatistic = {
  team: { id: string; name: string; concept: string; color: string };
  judgeDetails: {
    judgeNumber: number;
    ideaConcept: number;
    choreography: number;
    synchronization: number;
    performance: number;
    costume: number;
    total: number;
  }[];
  judgeAvg: number;
  btcScore: number;
  totalScore: number;
};
