import { z } from 'zod';
import { IEnv, LogLevel } from './IEnv.ts';

const schema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_LOG_LEVEL: z.nativeEnum(LogLevel),
});

export class ProcessEnv implements IEnv {
  static parse(data: unknown): ProcessEnv {
    const { VITE_LOG_LEVEL, VITE_API_BASE_URL } = schema.parse(data);
    return new ProcessEnv(VITE_API_BASE_URL, VITE_LOG_LEVEL);
  }

  constructor(
    public apiBaseUrl: string,
    public logLevel: LogLevel,
  ) {}
}
