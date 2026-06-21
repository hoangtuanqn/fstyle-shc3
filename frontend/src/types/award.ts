export type AwardWinner = {
  slot: number;
  winnerTeamId: string | null;
  winnerUserId: string | null;
  winnerName: string | null;
};

export type AwardType = {
  id: string;
  name: string;
  type: 'AUTO' | 'MANUAL';
  winnerType: 'TEAM' | 'INDIVIDUAL';
  quantity: number;
  prize: string | null;
  displayOrder: number;
  winners: AwardWinner[];
};

export type UpdateAwardInput = {
  winners: AwardWinner[];
};
