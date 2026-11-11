import { Router } from 'express';

import { sanitizeBody } from '../middleware/sanitize-body.js';
import { validateObjectId } from '../middleware/validate-object-id.js';
import { doctorService } from '../services/doctor.service.js';

// Express 5 forwards rejected promises to the error handler, so no try/catch is needed.
export const doctorsRouter = Router();

doctorsRouter.param('id', validateObjectId);

doctorsRouter.get('/', async (_req, res) => {
  res.json(await doctorService.list());
});

doctorsRouter.get('/:id', async (req, res) => {
  res.json(await doctorService.getById(req.params.id));
});

doctorsRouter.post('/', sanitizeBody, async (req, res) => {
  res.status(201).json(await doctorService.create(req.body));
});

doctorsRouter.put('/:id', sanitizeBody, async (req, res) => {
  res.json(await doctorService.update(req.params.id, req.body));
});

doctorsRouter.delete('/:id', async (req, res) => {
  await doctorService.remove(req.params.id);
  res.status(204).end();
});
