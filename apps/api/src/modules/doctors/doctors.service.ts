import type { QueryFilter, SortOrder, Types } from 'mongoose';
import type {
  Doctor as DoctorResponse,
  DoctorInput,
  DoctorQuery,
  DoctorSort,
} from '@doctor-tracker/shared';
import { notFound } from '../../lib/http-error.js';
import { dateRangeFilter, paginate } from '../../lib/query.js';
import { prefixMatchers } from '../../lib/search.js';
import { Doctor, type DoctorDoc } from '../../models/doctor.model.js';
import { Patient } from '../../models/patient.model.js';

type LeanDoctor = DoctorDoc & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };

const SORTS: Record<DoctorSort, Record<string, SortOrder>> = {
  newest: { createdAt: -1, _id: -1 },
  oldest: { createdAt: 1, _id: 1 },
  name: { name: 1, _id: 1 },
};

const toDoctor = (doctor: LeanDoctor, patientCount: number): DoctorResponse => ({
  id: doctor._id.toString(),
  name: doctor.name,
  specialization: doctor.specialization,
  hospital: doctor.hospital,
  phone: doctor.phone,
  email: doctor.email,
  patientCount,
  createdAt: doctor.createdAt.toISOString(),
  updatedAt: doctor.updatedAt.toISOString(),
});

async function patientCountsFor(doctorIds: Types.ObjectId[]) {
  if (!doctorIds.length) return new Map<string, number>();

  const rows = await Patient.aggregate<{ _id: Types.ObjectId; count: number }>([
    { $match: { doctor: { $in: doctorIds } } },
    { $group: { _id: '$doctor', count: { $sum: 1 } } },
  ]);

  return new Map(rows.map((row) => [row._id.toString(), row.count]));
}

export async function listDoctors(query: DoctorQuery) {
  const { search, specialization, from, to, sort, page, limit } = query;
  const filter: QueryFilter<DoctorDoc> = {};

  if (search) filter.searchTokens = { $all: prefixMatchers(search) };
  if (specialization) filter.specialization = specialization;
  if (from || to) filter.createdAt = dateRangeFilter(from, to);

  const result = await paginate(
    Doctor.find(filter)
      .sort(SORTS[sort])
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<LeanDoctor[]>(),
    Object.keys(filter).length ? Doctor.countDocuments(filter) : Doctor.estimatedDocumentCount(),
    { page, limit },
  );

  const counts = await patientCountsFor(result.data.map((doctor) => doctor._id));

  return {
    data: result.data.map((doctor) => toDoctor(doctor, counts.get(doctor._id.toString()) ?? 0)),
    meta: result.meta,
  };
}

export async function createDoctor(input: DoctorInput) {
  const doctor = await Doctor.create(input);
  return toDoctor(doctor.toObject(), 0);
}

export async function getDoctor(id: string) {
  const [doctor, patientCount] = await Promise.all([
    Doctor.findById(id).lean<LeanDoctor>(),
    Patient.countDocuments({ doctor: id }),
  ]);

  if (!doctor) throw notFound('Doctor');
  return toDoctor(doctor, patientCount);
}

export async function assertDoctorExists(id: string) {
  if (!(await Doctor.exists({ _id: id }))) throw notFound('Doctor');
}
