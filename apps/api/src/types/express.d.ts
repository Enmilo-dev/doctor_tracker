import type { Role } from '@doctor-tracker/shared';

declare global {
  namespace Express {
    interface Locals {
      user: { id: string; role: Role };
    }
  }
}

export {};
