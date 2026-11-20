import 'dotenv/config';

const int = (v, d) => (Number.isFinite(Number.parseInt(v, 10)) ? Number.parseInt(v, 10) : d);
const list = (v) => (v || '').split(',').map((s) => s.trim()).filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: int(process.env.PORT, 5050),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/docvise_microsite',
  allowedOrigins: list(process.env.ALLOWED_ORIGINS || 'http://localhost:5173'),
  trustProxy: int(process.env.TRUST_PROXY, 0),
  enquiryRate: {
    windowMs: int(process.env.ENQUIRY_RATE_WINDOW_MINUTES, 15) * 60 * 1000,
    max: int(process.env.ENQUIRY_RATE_MAX, 5),
  },
  jwtSecret: process.env.JWT_SECRET || '',
  adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: int(process.env.SMTP_PORT, 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.NOTIFY_FROM || '',
    to: process.env.NOTIFY_TO || '',
  },
};

/** Admin routes stay disabled until they are configured safely. */
export const adminConfigured = () => env.jwtSecret.length >= 32 && Boolean(env.adminEmail) && env.adminPasswordHash.startsWith('scrypt$');

export function checkEnv(logger = console) {
  if (!adminConfigured()) logger.warn('[config] Admin API disabled: set JWT_SECRET (32+ chars), ADMIN_EMAIL and ADMIN_PASSWORD_HASH to enable it.');
  if (!env.smtp.host) logger.warn('[config] SMTP not configured: enquiries will be saved, email notifications skipped.');
  if (env.isProd && env.allowedOrigins.some((o) => o.includes('localhost'))) logger.warn('[config] ALLOWED_ORIGINS includes localhost in production.');
}
