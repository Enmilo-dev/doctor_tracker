import mongoose from 'mongoose';
import { env, isProduction } from '../config/env.js';
import { logger } from '../lib/logger.js';

export async function connectDb() {
  await mongoose.connect(env.MONGODB_URI, { autoIndex: !isProduction });
  logger.info({ db: mongoose.connection.name }, 'MongoDB connected');
}

export async function disconnectDb() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
