import { Router, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

import { APIError } from '../../error-handler/definition';

const router = Router();

const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'middleware',
  points: Number(process.env['APP.SECURITY.RATE_LIMITER.MAX_REQ'] || '1000'),
  duration: Number(process.env['APP.SECURITY.RATE_LIMITER.MAX_REQ'] || '1')
});

router.use(helmet());

router.use((req: Request, res: Response, next: NextFunction) => {
  rateLimiter.consume(req.ip)
    .then(() => { next(); })
    .catch((result: RateLimiterRes) => {
      next(new APIError(429, undefined, undefined, 'Too many requests!'));
    });
});

export default router;