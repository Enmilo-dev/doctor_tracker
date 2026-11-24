import type { ErrorRequestHandler, RequestHandler, Response } from 'express';
import mongoose from 'mongoose';
import { z, ZodError } from 'zod';
import type { ApiErrorBody } from '@doctor-tracker/shared';
import { HttpError } from '../lib/http-error.js';

const send = (res: Response, status: number, code: string, message: string, details?: unknown) => {
  const body: ApiErrorBody = { error: { code, message, ...(details ? { details } : {}) } };
  res.status(status).json(body);
};

const isDuplicateKeyError = (
  err: unknown,
): err is { code: number; keyValue?: Record<string, unknown> } =>
  typeof err === 'object' && err !== null && 'code' in err && err.code === 11000;

const isClientError = (
  err: unknown,
): err is { status: number; expose?: boolean; type?: string; message: string } =>
  typeof err === 'object' &&
  err !== null &&
  'status' in err &&
  typeof err.status === 'number' &&
  err.status >= 400 &&
  err.status < 500;

export const notFoundHandler: RequestHandler = (req, res) => {
  send(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`);
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    return send(res, 400, 'VALIDATION_ERROR', 'Invalid request data', z.flattenError(err));
  }

  if (err instanceof HttpError) {
    return send(res, err.status, err.code, err.message, err.details);
  }

  if (err instanceof mongoose.Error.VersionError) {
    return send(
      res,
      409,
      'CONFLICT',
      'This record was changed by someone else. Reload and try again.',
    );
  }

  if (isDuplicateKeyError(err)) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'value';
    const message = `This ${field} is already in use`;
    return send(res, 409, 'CONFLICT', message, { fieldErrors: { [field]: [message] } });
  }

  if (isClientError(err)) {
    if (err.type === 'entity.parse.failed') {
      return send(res, 400, 'INVALID_JSON', 'Malformed JSON body');
    }
    return send(res, err.status, 'BAD_REQUEST', err.expose ? err.message : 'Bad request');
  }

  req.log.error({ err }, 'Unhandled error');
  send(res, 500, 'INTERNAL_ERROR', 'Something went wrong');
};
