import type { CookieOptions, RequestHandler } from 'express';
import { loginSchema, SESSION_COOKIE } from '@doctor-tracker/shared';
import { env, isProduction } from '../../config/env.js';
import * as authService from './auth.service.js';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  path: '/',
};

export const login: RequestHandler = async (req, res) => {
  const { user, token } = await authService.login(loginSchema.parse(req.body));
  res.cookie(SESSION_COOKIE, token, {
    ...cookieOptions,
    maxAge: env.SESSION_TTL_HOURS * 60 * 60 * 1000,
  });
  res.json({ data: user });
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(SESSION_COOKIE, cookieOptions);
  res.status(204).end();
};

export const me: RequestHandler = async (_req, res) => {
  const user = await authService.getUser(res.locals.user.id);
  res.json({ data: user });
};
