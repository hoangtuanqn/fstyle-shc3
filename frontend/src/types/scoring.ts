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
};

export type BtcScoreRow = {
  id: string;
  teamId: string;
  discipline: string;
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
};

export type BtcScoreInput = {
  discipline: number;
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
