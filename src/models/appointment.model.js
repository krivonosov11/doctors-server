import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // Field name kept as `doctor_id` for compatibility with the existing client.
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    gender: { type: String, required: true, trim: true },
    picker: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true },
  },
);

// Exposes the related doctor as `appointment.doctor` when populated.
appointmentSchema.virtual('doctor', {
  ref: 'Doctor',
  localField: 'doctor_id',
  foreignField: '_id',
  justOne: true,
});

// The collection name matches the one created by the original model ("Appoitment"),
// so existing data keeps working after the rename.
export const Appointment = mongoose.model('Appointment', appointmentSchema, 'appoitments');
