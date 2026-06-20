import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import leaderboardService from '~/services/leaderboard.service';

class LeaderboardController {
  getLeaderboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await leaderboardService.getLeaderboard();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };
}

export default new LeaderboardController();
