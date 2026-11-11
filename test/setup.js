import { after, afterEach, before } from 'node:test';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { createApp } from '../src/app.js';

/** Spins up an in-memory MongoDB per test file and returns a supertest agent. */
export const setupTestApp = () => {
  let mongod;
  const ctx = {};

  before(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    ctx.api = request(createApp());
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  return ctx;
};

export const doctorFixture = (overrides = {}) => ({
  name: 'Dr. Jane Smith',
  description: 'Experienced cardiologist',
  specialization: 'Cardiology',
  age: 45,
  ...overrides,
});

export const appointmentFixture = (doctorId, overrides = {}) => ({
  name: 'John Doe',
  doctor_id: doctorId,
  gender: 'male',
  picker: '2026-12-01T10:00',
  comment: 'Regular check-up',
  ...overrides,
});
