import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { fail } from './errors.js';

const secret = () => {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error('JWT_SECRET має бути заданий і містити щонайменше 32 символи.');
  return value;
};

export function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, companyId: user.companyId.toString() },
    secret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d', issuer: 'dm-system-api', audience: 'dm-system-clients' },
  );
}

export async function getUserFromAuthHeader(header = '') {
  if (!header) return null;
  const [scheme, token, extra] = header.split(' ');
  if (scheme !== 'Bearer' || !token || extra) return null;
  try {
    const payload = jwt.verify(token, secret(), { issuer: 'dm-system-api', audience: 'dm-system-clients' });
    return await User.findOne({ _id: payload.sub, isActive: true });
  } catch {
    return null;
  }
}

export function hashInvitationCode(code) {
  return crypto.createHash('sha256').update(String(code).trim().toUpperCase()).digest('hex');
}

export function createInvitationCode() {
  return crypto.randomBytes(5).toString('hex').toUpperCase().match(/.{1,5}/g).join('-');
}

export function safeAuthError() {
  fail('Невірна електронна адреса або пароль.', 'UNAUTHENTICATED');
}
