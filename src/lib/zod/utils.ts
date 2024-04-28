import { z } from 'zod';

export const zNumber = z.string().regex(/^\d+$/).transform(Number);
