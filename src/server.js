import mongoose from 'mongoose';

import { createApp } from './app.js';
import { config } from './config/index.js';

const start = async () => {
  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB');

  const app = createApp({ corsOrigin: config.corsOrigin });
  const server = app.listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port} (${config.env})`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
    // Force-exit if connections don't drain in time.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
