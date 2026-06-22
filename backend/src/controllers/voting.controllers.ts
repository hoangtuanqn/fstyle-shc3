import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import votingService from '~/services/voting.service';

import type { RoleType } from '~/constants/enums';

class VotingController {
  getCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await votingService.getCandidates(req.userId!, req.role! as RoleType);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  getMyVotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await votingService.getMyVotes(req.userId!);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  vote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await votingService.vote(req.userId!, req.role! as RoleType, req.body.candidateId);
      res.status(HTTP_STATUS.CREATED).json(new ResponseClient({ message: 'Vote thành công!' }));
    } catch (err) {
      next(err);
    }
  };

  getVoteLeaderboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await votingService.getVoteLeaderboard();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  removeVote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await votingService.removeVote(req.userId!, req.params.candidateId as string);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Đã hủy vote!' }));
    } catch (err) {
      next(err);
    }
  };
}

export default new VotingController();
