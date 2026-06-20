export type AwardType = {
  id: string;
  name: string;
  type: 'AUTO' | 'MANUAL';
  winnerType: 'TEAM' | 'INDIVIDUAL';
  winnerTeamId: string | null;
  winnerUserId: string | null;
  winnerName: string | null;
  quantity: number;
  prize: string | null;
  displayOrder: number;
};

export type UpdateAwardInput = {
  winnerTeamId?: string | null;
  winnerUserId?: string | null;
  winnerName?: string | null;
};
