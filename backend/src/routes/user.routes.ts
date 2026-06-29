import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import userController from '~/controllers/user.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';
import { createUserSchema, updateUserSchema, userIdParamSchema } from '~/schemas/user.schema';
import { validate } from '~/utils/validation';

const userRouter = Router();

const adminOnly = [middlewareAuth.auth, isRole([RoleType.ADMIN])];

userRouter.get('/teams', ...adminOnly, userController.getTeams);
userRouter.get('/', ...adminOnly, userController.getAll);
userRouter.post('/', ...adminOnly, validate(createUserSchema), userController.create);
userRouter.put('/:id', ...adminOnly, validate(updateUserSchema), userController.update);
userRouter.delete('/:id', ...adminOnly, validate(userIdParamSchema), userController.delete);
userRouter.post('/:id/reset-password', ...adminOnly, validate(userIdParamSchema), userController.resetPassword);

export default userRouter;
