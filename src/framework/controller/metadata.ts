import { getHooks, hook } from 'ts-ioc-container';

export const action = hook('action');

export function getActions(target: object) {
  return getHooks(target, 'action');
}
