import { Resolvable } from 'ts-ioc-container';

export const IEnvKey = Symbol('IEnv');

export enum LogLevel {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

export interface IEnv {
  logLevel: LogLevel;
  apiBaseUrl: string;
}

export const env =
  <T extends keyof IEnv>(key: T) =>
  (l: Resolvable) =>
    l.resolve<IEnv>(IEnvKey)[key];
