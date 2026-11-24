import { Doctor } from '../models/doctor.model.js';
import { Patient } from '../models/patient.model.js';
import { User } from '../models/user.model.js';

export const syncAllIndexes = () =>
  Promise.all([User.syncIndexes(), Doctor.syncIndexes(), Patient.syncIndexes()]);
