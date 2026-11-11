import { isValidObjectId } from 'mongoose';

import { Appointment } from '../models/appointment.model.js';
import { HttpError } from '../utils/http-error.js';
import { doctorService } from './doctor.service.js';

const UPDATE_OPTIONS = { returnDocument: 'after', runValidators: true };

const orNotFound = (doc) => {
  if (!doc) throw HttpError.notFound('Appointment not found');
  return doc;
};

const assertDoctorExists = async (doctorId) => {
  if (doctorId === undefined) return;
  if (!isValidObjectId(doctorId) || !(await doctorService.exists(doctorId))) {
    throw HttpError.badRequest('Validation failed', { doctor_id: 'Doctor does not exist' });
  }
};

export const appointmentService = {
  list() {
    return Appointment.find().sort({ createdAt: -1 }).populate('doctor');
  },

  async getById(id) {
    return orNotFound(await Appointment.findById(id).populate('doctor'));
  },

  async create(data) {
    await assertDoctorExists(data.doctor_id);
    const appointment = await Appointment.create(data);
    return appointment.populate('doctor');
  },

  async update(id, data) {
    await assertDoctorExists(data.doctor_id);
    return orNotFound(
      await Appointment.findByIdAndUpdate(id, data, UPDATE_OPTIONS).populate('doctor'),
    );
  },

  async remove(id) {
    orNotFound(await Appointment.findByIdAndDelete(id));
  },
};
