import { Router } from 'express';

import authRouter from '~/routes/auth.routes';
import scoringRouter from '~/routes/scoring.routes';
import votingRouter from '~/routes/voting.routes';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/voting', votingRouter);
rootRouter.use('/scoring', scoringRouter);

export default rootRouter;
