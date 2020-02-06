import { Router, Request, Response, NextFunction } from 'express';
import { parse, BasicAuthResult } from 'basic-auth';
import { get } from 'lodash';

import { container } from '../../di';
import { TYPES } from '../../di/types';
import IOAuth2 from '../../service/oauth2';

import { authenticate } from '../../middleware/auth/index';

import { AuthorizationError } from '../../error-handler/definition';
import { TokenError, Token } from '../../entity/oauth2';

const oAuth2Controller: IOAuth2 = container.get<IOAuth2>(TYPES.OAuth2Controller);

const router = Router();

router.use('/login', authenticate, (req: Request, res: Response, next: NextFunction) => {
  const user: BasicAuthResult | undefined = parse(req.get('Authorization') || '');
  const userObj = { username: get(user, 'name') };
  oAuth2Controller.generate(userObj)
    .then((token: TokenError | Token) => res.json(token))
    .catch((error: TokenError) => next(new AuthorizationError(error.description || error.message)));
});

router.use('/refresh-token', (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.get('bearer') || '';
  oAuth2Controller.refresh(refreshToken)
    .then((token: TokenError | Token) => res.json(token))
    .catch((error: TokenError) => next(new AuthorizationError(error.description || error.message)));
});

export default router;