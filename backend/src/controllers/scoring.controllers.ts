import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import scoringService from '~/services/scoring.service';

class ScoringController {
  getTeams = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await scoringService.getTeams();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  getTeamScores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await scoringService.getTeamScores(req.params.teamId as string);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  saveJudgeScores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await scoringService.saveJudgeScores(req.params.teamId as string, req.body);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Lưu điểm BGK thành công!' }));
    } catch (err) {
      next(err);
    }
  };

  saveBtcScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await scoringService.saveBtcScore(req.params.teamId as string, req.body.discipline);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Lưu điểm BTC thành công!' }));
    } catch (err) {
      next(err);
    }
  };

  getStatistics = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await scoringService.getStatistics();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };
}

export default new ScoringController();
