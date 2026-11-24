import { randomUUID } from 'node:crypto';
import type { Types } from 'mongoose';
import type { AuthUser, LoginInput } from '@doctor-tracker/shared';
import { unauthorized } from '../../lib/http-error.js';
import { signSessionToken } from '../../lib/jwt.js';
import { hashPassword, verifyPassword } from '../../lib/password.js';
import { User, type UserDoc } from '../../models/user.model.js';

const dummyHash = hashPassword(randomUUID());

const toAuthUser = (user: Pick<UserDoc, 'name' | 'email' | 'role'> & { _id: Types.ObjectId }) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

export async function login({ email, password }: LoginInput) {
  const user = await User.findOne({ email }).select('+passwordHash').lean();
  const valid = await verifyPassword(user?.passwordHash ?? (await dummyHash), password);

  if (!user || !valid) throw unauthorized('Invalid email or password');

  const authUser: AuthUser = toAuthUser(user);
  const token = await signSessionToken({ sub: authUser.id, role: authUser.role });

  return { user: authUser, token };
}

export async function getUser(id: string): Promise<AuthUser> {
  const user = await User.findById(id).select('name email role').lean();
  if (!user) throw unauthorized('Account no longer exists');
  return toAuthUser(user);
}
