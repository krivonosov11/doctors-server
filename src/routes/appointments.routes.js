import { Router } from 'express';

import { sanitizeBody } from '../middleware/sanitize-body.js';
import { validateObjectId } from '../middleware/validate-object-id.js';
import { appointmentService } from '../services/appointment.service.js';

export const appointmentsRouter = Router();

appointmentsRouter.param('id', validateObjectId);

appointmentsRouter.get('/', async (_req, res) => {
  res.json(await appointmentService.list());
});

appointmentsRouter.get('/:id', async (req, res) => {
  res.json(await appointmentService.getById(req.params.id));
});

appointmentsRouter.post('/', sanitizeBody, async (req, res) => {
  res.status(201).json(await appointmentService.create(req.body));
});

appointmentsRouter.put('/:id', sanitizeBody, async (req, res) => {
  res.json(await appointmentService.update(req.params.id, req.body));
});

appointmentsRouter.delete('/:id', async (req, res) => {
  await appointmentService.remove(req.params.id);
  res.status(204).end();
});
