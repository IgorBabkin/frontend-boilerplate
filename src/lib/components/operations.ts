import { getHooks, hook } from 'ts-ioc-container';

export interface IGuard<TPayload = unknown> {
  execute(resource: TPayload, method: string): void;

  match?(payload: unknown): payload is TPayload;
}

export function matchPayload<TPayload>(command: IGuard<TPayload>, payload: unknown): payload is TPayload {
  return command.match ? command.match(payload) : true;
}

export const action = hook('action');
export function getActions(target: object) {
  return getHooks(target, 'action');
}

export const query = hook('query');
export function getQuery(target: object) {
  return getHooks(target, 'query');
}

export const isClassInstance = (target: unknown): target is object =>
  target !== null && typeof target === 'object' && typeof target.constructor === 'function';
