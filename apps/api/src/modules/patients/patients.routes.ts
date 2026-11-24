import { Router } from 'express';
import * as patientsController from './patients.controller.js';

export const patientsRouter = Router();

patientsRouter.get('/', patientsController.list);
patientsRouter.patch('/:id', patientsController.update);
patientsRouter.delete('/:id', patientsController.remove);
