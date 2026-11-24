import { Router } from 'express';
import * as statsController from './stats.controller.js';

export const statsRouter = Router();

statsRouter.get('/', statsController.dashboard);
