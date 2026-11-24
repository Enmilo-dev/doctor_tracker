import type { RequestHandler } from 'express';
import { SESSION_COOKIE, type Role } from '@doctor-tracker/shared';
import { forbidden, unauthorized } from '../lib/http-error.js';
import { verifySessionToken } from '../lib/jwt.js';

export const requireAuth: RequestHandler = async (req, res, next) => {
  const token: unknown = req.cookies?.[SESSION_COOKIE];
  if (typeof token !== 'string' || !token) throw unauthorized();

  const session = await verifySessionToken(token).catch(() => null);
  if (!session) throw unauthorized('Session expired or invalid');

  res.locals.user = { id: session.sub, role: session.role };
  next();
};

export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (_req, res, next) => {
    if (!roles.includes(res.locals.user.role)) throw forbidden();
    next();
  };
