import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import awardController from '~/controllers/award.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';
import { updateAwardSchema } from '~/schemas/award.schema';
import { validate } from '~/utils/validation';

const awardRouter = Router();

awardRouter.get('/', middlewareAuth.auth, awardController.getAll);
awardRouter.put(
  '/:awardId',
  middlewareAuth.auth,
  isRole([RoleType.ADMIN, RoleType.BTC_FSTYLE]),
  validate(updateAwardSchema),
  awardController.updateAward,
);
awardRouter.post('/auto-calculate', middlewareAuth.auth, isRole([RoleType.ADMIN]), awardController.autoCalculate);

export default awardRouter;
