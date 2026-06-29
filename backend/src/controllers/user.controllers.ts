import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import userService from '~/services/user.service';

class UserController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, teamId, search } = req.query as Record<string, string | undefined>;
      const result = await userService.getAll({ role, teamId, search });
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  getTeams = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userService.getTeams();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json(new ResponseClient({ message: 'Tạo tài khoản thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userService.update(req.params.id as string, req.body);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Cập nhật thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userService.delete(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Xóa tài khoản thành công!' }));
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userService.resetPassword(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Reset mật khẩu thành công!', result }));
    } catch (err) {
      next(err);
    }
  };
}

export default new UserController();
