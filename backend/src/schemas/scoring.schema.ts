import { z } from 'zod';

export const teamIdParamsSchema = z.object({
  params: z.object({
    teamId: z.string().trim().min(1, 'teamId không hợp lệ!'),
  }),
});

export const judgeScoresSchema = z.object({
  params: z.object({
    teamId: z.string().trim().min(1, 'teamId không hợp lệ!'),
  }),
  body: z.object({
    judgeNumber: z.number().int().min(1).max(3),
    ideaConcept: z.number().min(0).max(20),
    choreography: z.number().min(0).max(25),
    synchronization: z.number().min(0).max(20),
    performance: z.number().min(0).max(20),
    costume: z.number().min(0).max(10),
  }),
});

export const btcScoreSchema = z.object({
  params: z.object({
    teamId: z.string().trim().min(1, 'teamId không hợp lệ!'),
  }),
  body: z.object({
    discipline: z.number().min(0).max(5),
  }),
});
