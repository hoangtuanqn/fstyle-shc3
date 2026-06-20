import type { NextFunction, Request, Response } from 'express';
import type { ZodObject, ZodRawShape } from 'zod';

import { HTTP_STATUS } from '~/constants/httpStatus';

export const validate = (schema: ZodObject<ZodRawShape>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: any) {
      res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        status: false,
        message: 'Dữ liệu không hợp lệ!',
        errors: err.errors,
      });
    }
  };
};
