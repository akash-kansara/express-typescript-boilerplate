import { Router, Request, Response, NextFunction } from 'express';
import { parse, BasicAuthResult } from 'basic-auth';
import { get } from 'lodash';

import { authenticate } from '../../middleware/auth/index';

import { AuthorizationError } from '../../error-handler/definition';
import { TokenError, Token } from '../../entity/oauth2';

import IOauth2Service from '../../service/oauth2';
import JWT from '../../controller/jwt';

const jwt: IOauth2Service = new JWT();

const router = Router();

router.use('/login', authenticate, (req: Request, res: Response, next: NextFunction) => {
  const user: BasicAuthResult | undefined = parse(req.get('Authorization') || '');
  const userObj = { username: get(user, 'name') };
  jwt.generate(userObj)
    .then((token: TokenError | Token) => res.json(token))
    .catch((error: TokenError) => next(new AuthorizationError(error.description || error.message)));
});

router.use('/refresh-token', (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.get('bearer') || '';
  jwt.refresh(refreshToken)
    .then((token: TokenError | Token) => res.json(token))
    .catch((error: TokenError) => next(new AuthorizationError(error.description || error.message)));
});

export default router;