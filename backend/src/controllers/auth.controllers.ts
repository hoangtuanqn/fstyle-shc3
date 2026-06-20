import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import authService from '~/services/auth.service';
import { ResponseClient } from '~/rules/response';

class AuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      res.status(HTTP_STATUS.OK).json(
        new ResponseClient({
          message: 'Đăng nhập thành công!',
          result,
        }),
      );
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.logout(req.userId!);
      res.status(HTTP_STATUS.OK).json(
        new ResponseClient({ message: 'Đăng xuất thành công!' }),
      );
    } catch (err) {
      next(err);
    }
  };

  getInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.getInfo(req.userId!);
      res.status(HTTP_STATUS.OK).json(
        new ResponseClient({ message: 'Thành công!', result }),
      );
    } catch (err) {
      next(err);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refresh_token } = req.body;
      const result = await authService.refreshToken(req.userId!, refresh_token);
      res.status(HTTP_STATUS.OK).json(
        new ResponseClient({ message: 'Làm mới token thành công!', result }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();
