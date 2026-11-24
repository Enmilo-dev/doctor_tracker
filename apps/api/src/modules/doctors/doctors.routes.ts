import { Router } from 'express';
import * as doctorsController from './doctors.controller.js';

export const doctorsRouter = Router();

doctorsRouter.get('/', doctorsController.list);
doctorsRouter.post('/', doctorsController.create);
doctorsRouter.get('/:id', doctorsController.getOne);
doctorsRouter.post('/:id/patients', doctorsController.addPatient);
