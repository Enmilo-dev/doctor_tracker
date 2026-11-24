import type { QueryFilter, SortOrder, Types } from 'mongoose';
import type {
  Patient as PatientResponse,
  PatientInput,
  PatientQuery,
  PatientSort,
  PatientUpdateInput,
  Specialization,
} from '@doctor-tracker/shared';
import { badRequest, notFound } from '../../lib/http-error.js';
import { dateRangeFilter, paginate } from '../../lib/query.js';
import { prefixMatchers } from '../../lib/search.js';
import { Doctor } from '../../models/doctor.model.js';
import { Patient, type PatientDoc } from '../../models/patient.model.js';

interface PopulatedDoctor {
  _id: Types.ObjectId;
  name: string;
  specialization: Specialization;
}

type LeanPatient = Omit<PatientDoc, 'doctor'> & {
  _id: Types.ObjectId;
  doctor: PopulatedDoctor;
  createdAt: Date;
  updatedAt: Date;
};

const SORTS: Record<PatientSort, Record<string, SortOrder>> = {
  newest: { admittedAt: -1, _id: -1 },
  oldest: { admittedAt: 1, _id: 1 },
  name: { name: 1, _id: 1 },
};

const DOCTOR_FIELDS = 'name specialization';

const toPatient = (patient: LeanPatient): PatientResponse => ({
  id: patient._id.toString(),
  name: patient.name,
  age: patient.age,
  gender: patient.gender,
  phone: patient.phone,
  ...(patient.email && { email: patient.email }),
  condition: patient.condition,
  diagnosis: patient.diagnosis,
  admittedAt: patient.admittedAt.toISOString().slice(0, 10),
  doctor: {
    id: patient.doctor._id.toString(),
    name: patient.doctor.name,
    specialization: patient.doctor.specialization,
  },
  createdAt: patient.createdAt.toISOString(),
  updatedAt: patient.updatedAt.toISOString(),
});

export async function listPatients(query: PatientQuery) {
  const { search, condition, gender, doctor, from, to, sort, page, limit } = query;
  const filter: QueryFilter<PatientDoc> = {};

  if (search) filter.searchTokens = { $all: prefixMatchers(search) };
  if (condition) filter.condition = condition;
  if (gender) filter.gender = gender;
  if (doctor) filter.doctor = doctor;
  if (from || to) filter.admittedAt = dateRangeFilter(from, to);

  const result = await paginate(
    Patient.find(filter)
      .sort(SORTS[sort])
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('doctor', DOCTOR_FIELDS)
      .lean<LeanPatient[]>(),
    Object.keys(filter).length ? Patient.countDocuments(filter) : Patient.estimatedDocumentCount(),
    { page, limit },
  );

  return { data: result.data.map(toPatient), meta: result.meta };
}

async function getPatient(id: Types.ObjectId) {
  const patient = await Patient.findById(id).populate('doctor', DOCTOR_FIELDS).lean<LeanPatient>();
  if (!patient) throw notFound('Patient');
  return toPatient(patient);
}

export async function createPatient(doctorId: string, input: PatientInput) {
  const patient = await Patient.create({
    ...input,
    admittedAt: new Date(input.admittedAt),
    doctor: doctorId,
  });
  return getPatient(patient._id);
}

export async function updatePatient(id: string, input: PatientUpdateInput) {
  const { admittedAt, doctor, email, ...rest } = input;

  const patient = await Patient.findById(id);
  if (!patient) throw notFound('Patient');

  if (doctor && !(await Doctor.exists({ _id: doctor }))) {
    throw badRequest('Selected doctor does not exist');
  }

  patient.set(rest);
  if (admittedAt) patient.admittedAt = new Date(admittedAt);
  if (doctor) patient.set('doctor', doctor);
  if (email !== undefined) patient.set('email', email || undefined);
  await patient.save();

  return getPatient(patient._id);
}

export async function deletePatient(id: string) {
  const deleted = await Patient.findByIdAndDelete(id).select('_id').lean();
  if (!deleted) throw notFound('Patient');
}
