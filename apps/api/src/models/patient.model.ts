import { model, Schema, type InferSchemaType } from 'mongoose';
import { GENDERS, PATIENT_CONDITIONS } from '@doctor-tracker/shared';
import { tokenize } from '../lib/search.js';

const patientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 130 },
    gender: { type: String, enum: GENDERS, required: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    condition: { type: String, enum: PATIENT_CONDITIONS, required: true },
    diagnosis: { type: String, required: true, trim: true },
    admittedAt: { type: Date, required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    searchTokens: { type: [String], select: false },
  },
  { timestamps: true },
);

patientSchema.pre('validate', function () {
  this.searchTokens = tokenize(this.name, this.diagnosis, this.email);
});

patientSchema.index({ doctor: 1, admittedAt: -1, _id: -1 });
patientSchema.index({ condition: 1, admittedAt: -1, _id: -1 });
patientSchema.index({ gender: 1, admittedAt: -1, _id: -1 });
patientSchema.index({ doctor: 1, name: 1, _id: 1 });
patientSchema.index({ admittedAt: -1, _id: -1 });
patientSchema.index({ searchTokens: 1 });
patientSchema.index({ name: 1, _id: 1 });

export type PatientDoc = InferSchemaType<typeof patientSchema>;

export const Patient = model('Patient', patientSchema);
