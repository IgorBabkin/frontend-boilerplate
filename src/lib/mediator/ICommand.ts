import { Observable } from 'rxjs';
import { constructor, getMetadata, setMetadata } from 'ts-ioc-container';
import { getHooks, hook } from '../hook.ts';

export interface ICommand<TPayload = unknown> {
  execute(payload: TPayload): Promise<void>;

  match?(payload: unknown): payload is TPayload;
}

export type ServiceInfo = { service: object; method: string | number | symbol };

export interface IGuard<TPayload = unknown> {
  execute(resource: TPayload, method: string): void;

  match?(payload: unknown): payload is TPayload;
}

export function matchPayload<TPayload>(command: IGuard<TPayload>, payload: unknown): payload is TPayload {
  return command.match ? command.match(payload) : true;
}

export interface IObservableQuery<TPayload = unknown, TResponse = unknown> {
  create(payload: TPayload): Observable<TResponse>;
}

export const beforeExecution = (...commands: constructor<ICommand>[]) => setMetadata('beforeExecution', commands);
export const getBeforeExecution = (condition: ICommand | IObservableQuery) =>
  getMetadata<constructor<ICommand>[]>(condition.constructor, 'beforeExecution') ?? [];

export const command = hook('command');
export function getCommands(target: object): string[] {
  return getHooks(target, 'command') ?? [];
}

export const query = hook('query');
export function getQuery(target: object): string[] {
  return getHooks(target, 'query') ?? [];
}

export const isClassInstance = (target: unknown): target is object =>
  target !== null && typeof target === 'object' && typeof target.constructor === 'function';
