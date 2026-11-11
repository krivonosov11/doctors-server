import { isValidObjectId } from 'mongoose';

import { HttpError } from '../utils/http-error.js';

/** Router param handler: rejects malformed ids with 400 before they reach the database. */
export const validateObjectId = (req, _res, next, id) => {
  if (!isValidObjectId(id)) {
    return next(HttpError.badRequest(`Invalid id: ${id}`));
  }
  next();
};
