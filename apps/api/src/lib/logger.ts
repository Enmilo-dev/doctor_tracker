import { pino } from 'pino';

export const logger = pino({
  redact: ['req.headers.cookie', 'req.headers.authorization', 'res.headers["set-cookie"]'],
});
