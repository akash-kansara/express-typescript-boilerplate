import { Request, Response, NextFunction } from 'express';
import { get, set } from 'lodash';

import { APIError } from './definition';

const errorHandler: any = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (!get(error, 'httpStatusCode')) {
    res.status(500);
  } else {
    res.status(get(error, 'httpStatusCode'));
    set(error, 'httpStatusCode', undefined);
  }
  if (res.statusCode === 500) {
    const apiError = new APIError(500);
    set(apiError, 'error', error);
    res.send(apiError);
  } else {
    res.send(error);
  }
};

export default errorHandler;