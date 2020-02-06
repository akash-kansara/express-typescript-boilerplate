import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';

import { StandardError } from '../entity/standard-operation';

export class APIError extends StandardError {

  public httpStatusCode: number;

  constructor(
    httpStatusCode: number,
    statusCode?: string,
    status?: string,
    description?: string,
    message?: string
  ) {
    super(
      statusCode || 'S_API_F',
      status || 'Server failure',
      description || 'Failure while processing request',
      message
    );
    this.httpStatusCode = httpStatusCode;
  }
}

export class APINotFoundError extends APIError {
  constructor() {
    super(NOT_FOUND, undefined, undefined, undefined, 'No such method');
  }
}

export class AuthenticationError extends APIError {
  constructor(message?: string | undefined) {
    super(UNAUTHORIZED, 'S_AUTHCN_F', 'Authentication failure', 'Bad credentials received', message);
  }
}

export class AuthorizationError extends APIError {
  constructor(message?: string | undefined) {
    super(FORBIDDEN, 'S_AUTHZN_F', 'Authorization failure', 'Incorrect authorization received', message);
  }
}

export class PayloadError extends APIError {
  constructor(message: string) {
    super(BAD_REQUEST, 'S_PYLD_F', 'Bad payload', 'Incorrect details received', message);
  }
}