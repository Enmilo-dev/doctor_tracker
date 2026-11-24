import type { RequestHandler } from 'express';
import { idParamsSchema, patientQuerySchema, patientUpdateSchema } from '@doctor-tracker/shared';
import * as patientsService from './patients.service.js';

export const list: RequestHandler = async (req, res) => {
  res.json(await patientsService.listPatients(patientQuerySchema.parse(req.query)));
};

export const update: RequestHandler = async (req, res) => {
  const { id } = idParamsSchema.parse(req.params);
  const input = patientUpdateSchema.parse(req.body);
  res.json({ data: await patientsService.updatePatient(id, input) });
};

export const remove: RequestHandler = async (req, res) => {
  const { id } = idParamsSchema.parse(req.params);
  await patientsService.deletePatient(id);
  res.status(204).end();
};
