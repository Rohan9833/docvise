import express from 'express';
import { env } from './config/env.js';
import { securityHeaders, cors } from './middleware/security.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  if (env.trustProxy) app.set('trust proxy', env.trustProxy); // correct client IPs for rate limiting
  app.use(securityHeaders({ isProd: env.isProd }));
  app.use(cors({ allowedOrigins: env.allowedOrigins }));
  app.use(express.json({ limit: '10kb', strict: true }));
  app.use('/api', routes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
