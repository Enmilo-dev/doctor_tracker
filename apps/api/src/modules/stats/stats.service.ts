import type { Types } from 'mongoose';
import {
  PATIENT_CONDITIONS,
  SPECIALIZATIONS,
  type DashboardStats,
  type PatientCondition,
  type Specialization,
  type StatsQuery,
} from '@doctor-tracker/shared';
import { Doctor } from '../../models/doctor.model.js';
import { Patient } from '../../models/patient.model.js';

const TOP_DOCTORS = 10;

interface DoctorPatientCount {
  _id: Types.ObjectId;
  count: number;
  doctor: { name: string; specialization: Specialization };
}

const startOfMonthUtc = (date: Date, offset = 0) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));

const monthKey = (date: Date) => date.toISOString().slice(0, 7);

export async function getDashboardStats({ months }: StatsQuery): Promise<DashboardStats> {
  const now = new Date();
  const thisMonth = startOfMonthUtc(now);
  const nextMonth = startOfMonthUtc(now, 1);
  const lastMonth = startOfMonthUtc(now, -1);
  const lastMonthToDate = new Date(
    Math.min(lastMonth.getTime() + (now.getTime() - thisMonth.getTime()), thisMonth.getTime()),
  );
  const rangeStart = startOfMonthUtc(now, -(months - 1));

  const [
    doctorsBySpecialization,
    patients,
    critical,
    admittedThisMonth,
    admittedLastMonth,
    byCondition,
    admissionsByMonth,
    perDoctor,
  ] = await Promise.all([
    Doctor.aggregate<{ _id: Specialization; doctors: number }>([
      { $group: { _id: '$specialization', doctors: { $sum: 1 } } },
    ]),
    Patient.estimatedDocumentCount(),
    Patient.countDocuments({ condition: 'critical' }),
    Patient.countDocuments({ admittedAt: { $gte: thisMonth, $lt: nextMonth } }),
    Patient.countDocuments({ admittedAt: { $gte: lastMonth, $lt: lastMonthToDate } }),
    Patient.aggregate<{ _id: PatientCondition; count: number }>([
      { $sort: { condition: 1 } },
      { $group: { _id: '$condition', count: { $sum: 1 } } },
    ]),
    Patient.aggregate<{ _id: Date; count: number }>([
      { $match: { admittedAt: { $gte: rangeStart, $lt: nextMonth } } },
      {
        $group: {
          _id: { $dateTrunc: { date: '$admittedAt', unit: 'month', timezone: 'UTC' } },
          count: { $sum: 1 },
        },
      },
    ]),
    Patient.aggregate<DoctorPatientCount>([
      { $sort: { doctor: 1 } },
      { $group: { _id: '$doctor', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      {
        $lookup: {
          from: Doctor.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'doctor',
          pipeline: [{ $project: { _id: 0, name: 1, specialization: 1 } }],
        },
      },
      { $unwind: '$doctor' },
    ]),
  ]);

  const conditionCounts = new Map(byCondition.map((row) => [row._id, row.count]));
  const monthCounts = new Map(admissionsByMonth.map((row) => [monthKey(row._id), row.count]));
  const doctorCounts = new Map(doctorsBySpecialization.map((row) => [row._id, row.doctors]));

  const patientCounts = new Map<Specialization, number>();
  for (const row of perDoctor) {
    const key = row.doctor.specialization;
    patientCounts.set(key, (patientCounts.get(key) ?? 0) + row.count);
  }

  return {
    totals: {
      doctors: doctorsBySpecialization.reduce((sum, row) => sum + row.doctors, 0),
      patients,
      critical,
      admittedThisMonth,
      admittedLastMonth,
    },
    admissionsByMonth: Array.from({ length: months }, (_, index) => {
      const month = monthKey(startOfMonthUtc(now, index - (months - 1)));
      return { month, count: monthCounts.get(month) ?? 0 };
    }),
    patientsPerDoctor: perDoctor.slice(0, TOP_DOCTORS).map((row) => ({
      doctorId: row._id.toString(),
      name: row.doctor.name,
      specialization: row.doctor.specialization,
      count: row.count,
    })),
    byCondition: PATIENT_CONDITIONS.map((condition) => ({
      condition,
      count: conditionCounts.get(condition) ?? 0,
    })),
    bySpecialization: SPECIALIZATIONS.map((specialization) => ({
      specialization,
      doctors: doctorCounts.get(specialization) ?? 0,
      patients: patientCounts.get(specialization) ?? 0,
    })).sort((a, b) => b.patients - a.patients),
  };
}
