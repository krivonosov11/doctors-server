import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    img: { type: String, default: 'assets/images/d1.jpg' },
    age: { type: Number, required: true, min: 18, max: 120 },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
  },
);

export const Doctor = mongoose.model('Doctor', doctorSchema);
