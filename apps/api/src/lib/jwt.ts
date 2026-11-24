import { jwtVerify, SignJWT } from 'jose';
import { z } from 'zod';
import { ROLES, type Role } from '@doctor-tracker/shared';
import { env } from '../config/env.js';

const secret = new TextEncoder().encode(env.JWT_SECRET);
const ISSUER = 'doctor-tracker-api';
const AUDIENCE = 'doctor-tracker-web';

interface SessionPayload {
  sub: string;
  role: Role;
}

const roleSchema = z.enum(ROLES);

export const signSessionToken = ({ sub, role }: SessionPayload) =>
  new SignJWT({ role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${env.SESSION_TTL_HOURS}h`)
    .sign(secret);

export async function verifySessionToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ['HS256'],
    issuer: ISSUER,
    audience: AUDIENCE,
  });

  const role = roleSchema.safeParse(payload.role);
  if (!payload.sub || !role.success) throw new Error('Invalid session payload');

  return { sub: payload.sub, role: role.data };
}
