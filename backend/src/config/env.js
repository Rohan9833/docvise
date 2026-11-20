import 'dotenv/config';

const int = (v, d) => (Number.isFinite(Number.parseInt(v, 10)) ? Number.parseInt(v, 10) : d);
const list = (v) => (v || '').split(',').map((s) => s.trim()).filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: int(process.env.PORT, 5050),
  allowedOrigins: list(process.env.ALLOWED_ORIGINS || 'http://localhost:5173'),
  trustProxy: int(process.env.TRUST_PROXY, 0),
  enquiryRate: {
    windowMs: int(process.env.ENQUIRY_RATE_WINDOW_MINUTES, 15) * 60 * 1000,
    max: int(process.env.ENQUIRY_RATE_MAX, 5),
  },
  smtp: {
    host: process.env.EMAIL_HOST || process.env.SMTP_HOST || '',
    port: int(process.env.EMAIL_PORT || process.env.SMTP_PORT, 465),
    secure: String(process.env.EMAIL_SECURE ?? process.env.SMTP_SECURE ?? 'true').toLowerCase() === 'true',
    user: process.env.EMAIL_USER || process.env.SMTP_USER || '',
    pass: process.env.EMAIL_PASS || process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || process.env.NOTIFY_FROM || process.env.EMAIL_USER || process.env.SMTP_USER || '',
    to: process.env.NOTIFY_TO || 'info@digilateral.com',
  },
};

export function checkEnv(logger = console) {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass || !env.smtp.from || !env.smtp.to) {
    logger.warn('[config] SMTP is not fully configured. Demo requests will return an error until email settings are added.');
  }
  if (env.isProd && env.allowedOrigins.some((o) => o.includes('localhost'))) {
    logger.warn('[config] ALLOWED_ORIGINS includes localhost in production.');
  }
}
