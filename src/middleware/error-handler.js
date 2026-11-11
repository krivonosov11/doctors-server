import mongoose from 'mongoose';

import { HttpError } from '../utils/http-error.js';

const toHttpError = (err) => {
  if (err instanceof HttpError) return err;

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message]),
    );
    return HttpError.badRequest('Validation failed', details);
  }

  if (err instanceof mongoose.Error.CastError) {
    return HttpError.badRequest(`Invalid value for "${err.path}"`);
  }

  // Malformed JSON body (thrown by express.json()).
  if (err.type === 'entity.parse.failed') {
    return HttpError.badRequest('Malformed JSON body');
  }

  return null;
};

export const notFoundHandler = (req, _res, next) => {
  next(HttpError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

// Express recognises error handlers by their 4-argument signature.
export const errorHandler = (err, req, res, _next) => {
  const httpError = toHttpError(err);

  if (!httpError) {
    console.error(err);
    return res.status(500).json({ error: { message: 'Internal server error' } });
  }

  const { status, message, details } = httpError;
  res.status(status).json({ error: { message, ...(details && { details }) } });
};
