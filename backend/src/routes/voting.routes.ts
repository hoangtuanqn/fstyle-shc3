import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import votingController from '~/controllers/voting.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';
import { voteBodySchema, voteParamsSchema } from '~/schemas/voting.schema';
import { validate } from '~/utils/validation';

const votingRouter = Router();

votingRouter.get('/candidates', middlewareAuth.auth, isRole([RoleType.MEMBER, RoleType.BTC_FSTYLE]), votingController.getCandidates);
votingRouter.get('/my-votes', middlewareAuth.auth, isRole([RoleType.MEMBER, RoleType.BTC_FSTYLE]), votingController.getMyVotes);
votingRouter.post('/vote', middlewareAuth.auth, isRole([RoleType.MEMBER, RoleType.BTC_FSTYLE]), validate(voteBodySchema), votingController.vote);
votingRouter.delete('/vote/:candidateId', middlewareAuth.auth, isRole([RoleType.MEMBER, RoleType.BTC_FSTYLE]), validate(voteParamsSchema), votingController.removeVote);

export default votingRouter;
