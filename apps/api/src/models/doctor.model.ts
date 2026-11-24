import { model, Schema, type InferSchemaType } from 'mongoose';
import { SPECIALIZATIONS } from '@doctor-tracker/shared';
import { tokenize } from '../lib/search.js';

const doctorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, enum: SPECIALIZATIONS, required: true },
    hospital: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    searchTokens: { type: [String], select: false },
  },
  { timestamps: true },
);

doctorSchema.pre('validate', function () {
  this.searchTokens = tokenize(this.name, this.hospital, this.email);
});

doctorSchema.index({ searchTokens: 1 });
doctorSchema.index({ specialization: 1, createdAt: -1, _id: -1 });
doctorSchema.index({ createdAt: -1, _id: -1 });
doctorSchema.index({ name: 1, _id: 1 });

export type DoctorDoc = InferSchemaType<typeof doctorSchema>;

export const Doctor = model('Doctor', doctorSchema);
