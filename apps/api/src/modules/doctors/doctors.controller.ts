import type { RequestHandler } from 'express';
import {
  doctorCreateSchema,
  doctorQuerySchema,
  idParamsSchema,
  patientCreateSchema,
} from '@doctor-tracker/shared';
import * as patientsService from '../patients/patients.service.js';
import * as doctorsService from './doctors.service.js';

export const list: RequestHandler = async (req, res) => {
  res.json(await doctorsService.listDoctors(doctorQuerySchema.parse(req.query)));
};

export const create: RequestHandler = async (req, res) => {
  const doctor = await doctorsService.createDoctor(doctorCreateSchema.parse(req.body));
  res.status(201).json({ data: doctor });
};

export const getOne: RequestHandler = async (req, res) => {
  const { id } = idParamsSchema.parse(req.params);
  res.json({ data: await doctorsService.getDoctor(id) });
};

export const addPatient: RequestHandler = async (req, res) => {
  const { id } = idParamsSchema.parse(req.params);
  const input = patientCreateSchema.parse(req.body);
  await doctorsService.assertDoctorExists(id);
  res.status(201).json({ data: await patientsService.createPatient(id, input) });
};
