import { Request, Response, NextFunction } from 'express';
import { parse, BasicAuthResult } from 'basic-auth';
import { get, set } from 'lodash';

import { AuthenticationError, AuthorizationError } from '../../error-handler/definition';
import { BasicAuthError, UserCredential } from '../../entity/basic-auth';
import { TokenError } from '../../entity/oauth2';

import IBasicAuth from '../../service/basic-auth';
import IOauth2Service from '../../service/oauth2';
import BasicAuthController from '../../controller/basic-auth';
import JWTController from '../../controller/jwt';

const basicAuth: IBasicAuth = new BasicAuthController();
const jwt: IOauth2Service = new JWTController();

function authenticate(req: Request, res: Response, next: NextFunction) {
  const user: BasicAuthResult | undefined = parse(req.get('Authorization') || '');
  basicAuth.authenticate(new UserCredential(get(user, 'name') || '', get(user, 'pass') || ''))
    .then(() => next())
    .catch((error: BasicAuthError) => next(new AuthenticationError(error.message || error.description)));
}

function authorize(req: Request, res: Response, next: NextFunction) {
  const token = req.get('bearer') || '';
  jwt.validate(token, process.env['APP.SECURITY.ACCESS_TOKEN_SECRET'] || '')
    .then((user: string | object) => {
      set(req, 'user', user);
      next();
    })
    .catch((error: TokenError) => {
      next(new AuthorizationError(error.message || error.description));
    });
}

export { authenticate, authorize };