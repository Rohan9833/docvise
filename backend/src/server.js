import { env, checkEnv } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { createApp } from './app.js';

checkEnv();

try {
  await connectDB(env.mongoUri);
} catch (err) {
  console.error('[db] connection failed:', err.message);
  process.exit(1);
}

const server = createApp().listen(env.port, () => console.log(`[api] DocVise microsite API on http://localhost:${env.port}`));

const shutdown = (signal) => {
  console.log(`[api] ${signal} received, shutting down`);
  server.close(async () => {
    await disconnectDB().catch(() => {});
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
