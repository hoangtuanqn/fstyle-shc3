import { z } from 'zod';

export const updateAwardSchema = z.object({
  params: z.object({
    awardId: z.string().trim().min(1, 'awardId không hợp lệ!'),
  }),
  body: z.object({
    winnerTeamId: z.string().trim().nullable().optional(),
    winnerUserId: z.string().trim().nullable().optional(),
    winnerName: z.string().trim().max(255).nullable().optional(),
  }),
});
