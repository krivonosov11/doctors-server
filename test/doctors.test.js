import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { doctorFixture, setupTestApp } from './setup.js';

const ctx = setupTestApp();
const MISSING_ID = '507f1f77bcf86cd799439011';

describe('/doctors', () => {
  it('creates a doctor and applies defaults', async () => {
    const res = await ctx.api.post('/doctors').send(doctorFixture()).expect(201);

    assert.equal(res.body.name, 'Dr. Jane Smith');
    assert.equal(res.body.img, 'assets/images/d1.jpg');
    assert.ok(res.body._id);
    assert.equal(res.body.__v, undefined);
  });

  it('ignores a client-supplied _id', async () => {
    const res = await ctx.api
      .post('/doctors')
      .send({ ...doctorFixture(), _id: MISSING_ID })
      .expect(201);

    assert.notEqual(res.body._id, MISSING_ID);
  });

  it('rejects invalid input with field-level details', async () => {
    const res = await ctx.api.post('/doctors').send({ name: 'No details' }).expect(400);

    assert.equal(res.body.error.message, 'Validation failed');
    assert.ok(res.body.error.details.specialization);
    assert.ok(res.body.error.details.age);
  });

  it('rejects malformed JSON', async () => {
    await ctx.api
      .post('/doctors')
      .set('Content-Type', 'application/json')
      .send('{"name":')
      .expect(400);
  });

  it('lists doctors', async () => {
    await ctx.api.post('/doctors').send(doctorFixture({ name: 'B' }));
    await ctx.api.post('/doctors').send(doctorFixture({ name: 'A' }));

    const res = await ctx.api.get('/doctors').expect(200);
    assert.deepEqual(
      res.body.map((d) => d.name),
      ['A', 'B'],
    );
  });

  it('gets a doctor by id', async () => {
    const { body: created } = await ctx.api.post('/doctors').send(doctorFixture());
    const res = await ctx.api.get(`/doctors/${created._id}`).expect(200);
    assert.equal(res.body._id, created._id);
  });

  it('returns 404 for a missing doctor and 400 for a malformed id', async () => {
    await ctx.api.get(`/doctors/${MISSING_ID}`).expect(404);
    await ctx.api.get('/doctors/not-an-id').expect(400);
  });

  it('updates a doctor with validation', async () => {
    const { body: created } = await ctx.api.post('/doctors').send(doctorFixture());

    const res = await ctx.api.put(`/doctors/${created._id}`).send({ age: 50 }).expect(200);
    assert.equal(res.body.age, 50);
    assert.equal(res.body.name, created.name);

    await ctx.api.put(`/doctors/${created._id}`).send({ age: -1 }).expect(400);
    await ctx.api.put(`/doctors/${MISSING_ID}`).send({ age: 50 }).expect(404);
  });

  it('deletes a doctor', async () => {
    const { body: created } = await ctx.api.post('/doctors').send(doctorFixture());

    await ctx.api.delete(`/doctors/${created._id}`).expect(204);
    await ctx.api.get(`/doctors/${created._id}`).expect(404);
    await ctx.api.delete(`/doctors/${created._id}`).expect(404);
  });
});

describe('misc', () => {
  it('reports health', async () => {
    const res = await ctx.api.get('/health').expect(200);
    assert.deepEqual(res.body, { status: 'ok', db: true });
  });

  it('returns 404 JSON for unknown routes', async () => {
    const res = await ctx.api.get('/nope').expect(404);
    assert.match(res.body.error.message, /not found/);
  });
});
