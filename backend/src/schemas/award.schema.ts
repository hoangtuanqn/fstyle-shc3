import { z } from 'zod';

const emptyToNull = z
  .string()
  .trim()
  .transform((v) => (v === '' ? null : v))
  .nullable()
  .optional();

export const updateAwardSchema = z.object({
  params: z.object({
    awardId: z.string().trim().min(1, 'awardId không hợp lệ!'),
  }),
  body: z.object({
    winners: z
      .array(
        z.object({
          slot: z.number().int().min(1, 'Slot phải >= 1'),
          winnerTeamId: emptyToNull,
          winnerUserId: emptyToNull,
          winnerName: z.string().trim().max(255).transform((v) => (v === '' ? null : v)).nullable().optional(),
        }),
      )
      .min(1, 'Cần ít nhất 1 winner!'),
  }),
});
