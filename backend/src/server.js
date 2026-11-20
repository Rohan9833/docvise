import { env, checkEnv } from './config/env.js';
import { createApp } from './app.js';

checkEnv();

const server = createApp().listen(env.port, () => console.log(`[api] DocVise microsite API on http://localhost:${env.port}`));

const shutdown = (signal) => {
  console.log(`[api] ${signal} received, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
