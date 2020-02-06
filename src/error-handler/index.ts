import { Request, Response, NextFunction } from 'express';
import { get, set } from 'lodash';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';

import { APIError } from './definition';

const errorHandler: any = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (!get(error, 'httpStatusCode')) {
    res.status(INTERNAL_SERVER_ERROR);
  } else {
    res.status(get(error, 'httpStatusCode'));
    set(error, 'httpStatusCode', undefined);
  }
  if (res.statusCode === INTERNAL_SERVER_ERROR) {
    const apiError = new APIError(INTERNAL_SERVER_ERROR);
    set(apiError, 'error', error);
    res.send(apiError);
  } else {
    res.send(error);
  }
};

export default errorHandler;