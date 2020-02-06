import { Request, Response, NextFunction } from 'express';
import { parse, BasicAuthResult } from 'basic-auth';
import { get, set } from 'lodash';

import { myContainer } from '../../di/di-config';
import { TYPES } from '../../di/types';
import IBasicAuth from '../../service/basic-auth';
import IOAuth2 from '../../service/oauth2';

import { AuthenticationError, AuthorizationError } from '../../error-handler/definition';
import { BasicAuthError, UserCredential } from '../../entity/basic-auth';
import { TokenError } from '../../entity/oauth2';

const basicAuth: IBasicAuth = myContainer.get<IBasicAuth>(TYPES.BasicAuthController);
const oAuth2Controller: IOAuth2 = myContainer.get<IOAuth2>(TYPES.OAuth2Controller);

function authenticate(req: Request, res: Response, next: NextFunction) {
  const user: BasicAuthResult | undefined = parse(req.get('Authorization') || '');
  basicAuth.authenticate(new UserCredential(get(user, 'name') || '', get(user, 'pass') || ''))
    .then(() => next())
    .catch((error: BasicAuthError) => next(new AuthenticationError(error.message || error.description)));
}

function authorize(req: Request, res: Response, next: NextFunction) {
  const token = req.get('bearer') || '';
  oAuth2Controller.validateAccessToken(token)
    .then((user: string | object) => {
      set(req, 'user', user);
      next();
    })
    .catch((error: TokenError) => {
      next(new AuthorizationError(error.message || error.description));
    });
}

export { authenticate, authorize };