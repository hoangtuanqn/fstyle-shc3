import { Router } from 'express';

import authRouter from '~/routes/auth.routes';
import votingRouter from '~/routes/voting.routes';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/voting', votingRouter);

export default rootRouter;
