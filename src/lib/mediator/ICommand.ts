import { Observable } from 'rxjs';
import { constructor, getMetadata, setMetadata } from 'ts-ioc-container';
import { getHooks, hook } from '../hook.ts';

export interface ICommand<TPayload = unknown> {
  execute(payload: TPayload): Promise<void>;

  match?(payload: unknown): payload is TPayload;
}

export type ServiceInfo = { service: object; method: string | number | symbol };

export interface IGuard<TPayload = unknown> {
  execute(resource: TPayload, method: string): Promise<void>;

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

export const setTags = (...tags: string[]) => setMetadata('tags', tags);
export const getTags = (target: object): string[] => getMetadata<string[]>(target.constructor, 'tags') ?? [];

export const service = setTags('service', 'OnInit');
export const isService = (target: object): boolean => getTags(target).includes('service');
