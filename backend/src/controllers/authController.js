import { env, adminConfigured } from '../config/env.js';
import { signToken, verifyPassword, safeEqual } from '../utils/auth.js';

/** POST /api/admin/login – body: { email, password } → { token, expiresIn } */
export function adminLogin(req, res) {
  if (!adminConfigured()) return res.status(503).json({ message: 'Admin API is not configured.' });
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const emailOk = safeEqual(email, env.adminEmail);
  const passwordOk = verifyPassword(password, env.adminPasswordHash); // always evaluated to keep timing uniform
  if (!emailOk || !passwordOk) return res.status(401).json({ message: 'Invalid email or password.' });
  const expiresIn = 8 * 3600;
  return res.json({ token: signToken({ sub: email, role: 'admin' }, env.jwtSecret, expiresIn), expiresIn });
}
