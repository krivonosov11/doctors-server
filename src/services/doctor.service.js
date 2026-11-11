import { Doctor } from '../models/doctor.model.js';
import { HttpError } from '../utils/http-error.js';

const UPDATE_OPTIONS = { returnDocument: 'after', runValidators: true };

const orNotFound = (doc) => {
  if (!doc) throw HttpError.notFound('Doctor not found');
  return doc;
};

export const doctorService = {
  list() {
    return Doctor.find().sort({ name: 1 });
  },

  async getById(id) {
    return orNotFound(await Doctor.findById(id));
  },

  async exists(id) {
    return Boolean(await Doctor.exists({ _id: id }));
  },

  create(data) {
    return Doctor.create(data);
  },

  async update(id, data) {
    return orNotFound(await Doctor.findByIdAndUpdate(id, data, UPDATE_OPTIONS));
  },

  async remove(id) {
    orNotFound(await Doctor.findByIdAndDelete(id));
  },
};
