import { Router } from 'express';

import leaderboardController from '~/controllers/leaderboard.controllers';
import { middlewareAuth } from '~/middlewares/auth.middlewares';

const leaderboardRouter = Router();

leaderboardRouter.get('/', middlewareAuth.auth, leaderboardController.getLeaderboard);

export default leaderboardRouter;
