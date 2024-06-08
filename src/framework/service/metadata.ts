import { getHooks, hook } from 'ts-ioc-container';

/**
 * @deprecated use action from controller
 */
export const action = hook('action');

/**
 * @deprecated use action from controller
 */
export function getActions(target: object) {
  return getHooks(target, 'action');
}

/**
 * @deprecated use query from controller
 */
export const query = hook('query');

/**
 * @deprecated use query from controller
 */
export function getQuery(target: object) {
  return getHooks(target, 'query');
}