const PROTECTED_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt'];

/** Strips server-managed fields so clients can't overwrite them. */
export const sanitizeBody = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const field of PROTECTED_FIELDS) delete req.body[field];
  }
  next();
};
