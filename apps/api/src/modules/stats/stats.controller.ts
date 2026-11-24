import type { RequestHandler } from 'express';
import { statsQuerySchema } from '@doctor-tracker/shared';
import * as statsService from './stats.service.js';

export const dashboard: RequestHandler = async (req, res) => {
  res.json({ data: await statsService.getDashboardStats(statsQuerySchema.parse(req.query)) });
};
