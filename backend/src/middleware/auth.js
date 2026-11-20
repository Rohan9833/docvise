import { env, adminConfigured } from '../config/env.js';
import { verifyToken } from '../utils/auth.js';

/** Requires a valid admin bearer token. */
export function requireAdmin(req, res, next) {
  if (!adminConfigured()) {
    res.status(503).json({ message: 'Admin API is not configured.' });
    return;
  }
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const payload = verifyToken(token, env.jwtSecret);
  if (!payload) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  if (payload.role !== 'admin') {
    res.status(403).json({ message: 'You do not have access to this resource.' });
    return;
  }
  req.admin = payload;
  next();
}
