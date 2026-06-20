import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import scoringController from '~/controllers/scoring.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';
import { btcScoreSchema, judgeScoresSchema, teamIdParamsSchema } from '~/schemas/scoring.schema';
import { validate } from '~/utils/validation';

const scoringRouter = Router();

scoringRouter.get('/teams', middlewareAuth.auth, isRole([RoleType.ADMIN]), scoringController.getTeams);
scoringRouter.get('/teams/:teamId', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(teamIdParamsSchema), scoringController.getTeamScores);
scoringRouter.put('/judge-scores/:teamId', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(judgeScoresSchema), scoringController.saveJudgeScores);
scoringRouter.put('/btc-scores/:teamId', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(btcScoreSchema), scoringController.saveBtcScore);
scoringRouter.get('/statistics', middlewareAuth.auth, isRole([RoleType.ADMIN]), scoringController.getStatistics);

export default scoringRouter;
