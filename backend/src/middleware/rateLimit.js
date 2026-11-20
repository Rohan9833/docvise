/**
 * Small in-memory fixed-window rate limiter.
 * Suitable for a single server instance. For several instances, back it with a shared store (e.g. Redis).
 */
export function rateLimit({ windowMs, max, keyPrefix = 'rl', message = 'Too many requests. Please try again later.' }) {
  const hits = new Map();
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
  }, Math.min(windowMs, 60_000));
  sweep.unref?.();

  const limiter = (req, res, next) => {
    const now = Date.now();
    const key = `${keyPrefix}:${req.ip || req.socket?.remoteAddress || 'unknown'}`;
    let entry = hits.get(key);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    const remaining = Math.max(0, max - entry.count);
    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(remaining));
    res.setHeader('RateLimit-Reset', String(Math.ceil((entry.reset - now) / 1000)));
    if (entry.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.reset - now) / 1000)));
      res.status(429).json({ message });
      return;
    }
    next();
  };
  limiter.reset = () => hits.clear();
  return limiter;
}
