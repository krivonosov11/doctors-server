import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { appointmentFixture, doctorFixture, setupTestApp } from './setup.js';

const ctx = setupTestApp();
const MISSING_ID = '507f1f77bcf86cd799439011';

describe('/appointments', () => {
  let doctor;

  beforeEach(async () => {
    ({ body: doctor } = await ctx.api.post('/doctors').send(doctorFixture()));
  });

  it('creates an appointment and embeds the doctor', async () => {
    const res = await ctx.api
      .post('/appointments')
      .send(appointmentFixture(doctor._id))
      .expect(201);

    assert.equal(res.body.doctor_id, doctor._id);
    assert.equal(res.body.doctor._id, doctor._id);
    assert.equal(res.body.doctor.name, doctor.name);
  });

  it('rejects an appointment for a non-existent doctor', async () => {
    const res = await ctx.api
      .post('/appointments')
      .send(appointmentFixture(MISSING_ID))
      .expect(400);
    assert.ok(res.body.error.details.doctor_id);

    await ctx.api.post('/appointments').send(appointmentFixture('garbage')).expect(400);
  });

  it('rejects missing required fields', async () => {
    const res = await ctx.api.post('/appointments').send({ doctor_id: doctor._id }).expect(400);
    assert.ok(res.body.error.details.name);
    assert.ok(res.body.error.details.comment);
  });

  it('lists appointments with their doctors', async () => {
    await ctx.api.post('/appointments').send(appointmentFixture(doctor._id));
    await ctx.api.post('/appointments').send(appointmentFixture(doctor._id, { name: 'Ann' }));

    const res = await ctx.api.get('/appointments').expect(200);
    assert.equal(res.body.length, 2);
    for (const a of res.body) assert.equal(a.doctor.name, doctor.name);
  });

  it('returns doctor: null when the doctor was deleted', async () => {
    const { body: created } = await ctx.api
      .post('/appointments')
      .send(appointmentFixture(doctor._id));
    await ctx.api.delete(`/doctors/${doctor._id}`).expect(204);

    const res = await ctx.api.get(`/appointments/${created._id}`).expect(200);
    assert.equal(res.body.doctor, null);
  });

  it('updates an appointment', async () => {
    const { body: created } = await ctx.api
      .post('/appointments')
      .send(appointmentFixture(doctor._id));

    const res = await ctx.api
      .put(`/appointments/${created._id}`)
      .send({ comment: 'Moved to afternoon' })
      .expect(200);
    assert.equal(res.body.comment, 'Moved to afternoon');
    assert.equal(res.body.doctor.name, doctor.name);

    await ctx.api.put(`/appointments/${created._id}`).send({ doctor_id: MISSING_ID }).expect(400);
  });

  it('deletes an appointment', async () => {
    const { body: created } = await ctx.api
      .post('/appointments')
      .send(appointmentFixture(doctor._id));

    await ctx.api.delete(`/appointments/${created._id}`).expect(204);
    await ctx.api.get(`/appointments/${created._id}`).expect(404);
  });
});
