import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { HttpError } from '../../lib/http-error.js';
import { requireAuth } from '../../middleware/auth.js';
import * as authController from './auth.controller.js';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new HttpError(429, 'TOO_MANY_REQUESTS', 'Too many login attempts, try again later')),
});

export const authRouter = Router();

authRouter.post('/login', loginLimiter, authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', requireAuth, authController.me);
