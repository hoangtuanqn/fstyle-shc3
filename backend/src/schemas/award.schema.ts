import { z } from 'zod';

export const updateAwardSchema = z.object({
  params: z.object({
    awardId: z.string().trim().min(1, 'awardId không hợp lệ!'),
  }),
  body: z.object({
    winners: z
      .array(
        z.object({
          slot: z.number().int().min(1, 'Slot phải >= 1'),
          winnerTeamId: z.string().trim().nullable().optional(),
          winnerUserId: z.string().trim().nullable().optional(),
          winnerName: z.string().trim().max(255).nullable().optional(),
        }),
      )
      .min(1, 'Cần ít nhất 1 winner!'),
  }),
});
