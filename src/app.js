import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';

import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { appointmentsRouter } from './routes/appointments.routes.js';
import { doctorsRouter } from './routes/doctors.routes.js';

/** Builds the Express app without starting a server, so tests can use it directly. */
export const createApp = ({ corsOrigin = '*' } = {}) => {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    const dbUp = mongoose.connection.readyState === 1;
    res.status(dbUp ? 200 : 503).json({ status: dbUp ? 'ok' : 'degraded', db: dbUp });
  });

  app.use('/doctors', doctorsRouter);
  app.use('/appointments', appointmentsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
