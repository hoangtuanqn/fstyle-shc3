import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import awardService from '~/services/award.service';

import type { NextFunction, Request, Response } from 'express';
import type { RoleType } from '~/constants/enums';

class AwardController {
  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await awardService.getAll();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  updateAward = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await awardService.updateAward(
        req.params.awardId as string,
        req.role as RoleType,
        req.body.winners,
      );
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Cập nhật giải thưởng thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  autoCalculate = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await awardService.autoCalculate();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Tính giải tự động thành công!', result }));
    } catch (err) {
      next(err);
    }
  };
}

export default new AwardController();
