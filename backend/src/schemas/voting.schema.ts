import { z } from 'zod';

export const voteBodySchema = z.object({
  body: z.object({
    candidateId: z.string().trim().min(1, 'candidateId không được để trống!'),
  }),
});

export const voteParamsSchema = z.object({
  params: z.object({
    candidateId: z.string().trim().min(1, 'candidateId không được để trống!'),
  }),
});
