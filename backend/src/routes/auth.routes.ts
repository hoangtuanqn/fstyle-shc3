import { Router } from 'express';

import authController from '~/controllers/auth.controllers';
import { middlewareAuth } from '~/middlewares/auth.middlewares';
import { loginSchema } from '~/schemas/auth.schema';
import { validate } from '~/utils/validation';

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/logout', middlewareAuth.auth, authController.logout);
authRouter.get('/get-info', middlewareAuth.auth, authController.getInfo);
authRouter.post('/refresh', middlewareAuth.extractUserFromExpiredToken, authController.refreshToken);

export default authRouter;
