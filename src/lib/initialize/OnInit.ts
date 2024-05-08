import { executeHooks, Execution, hasHooks, hook, IContainer } from 'ts-ioc-container';

type Unsubscribe = () => void;

export interface OnInit {
  _isInitialized: Unsubscribe[];
}

export const onStart = (fn: Execution) => hook('__autorun__', fn);
export const startAutorun = (instance: object, scope: IContainer) => executeHooks(instance, '__autorun__', { scope });
export const hasAutorunHooks = (instance: object) => hasHooks(instance, '__autorun__');

export function isInitializable(target: object): target is OnInit {
  return hasAutorunHooks(target);
}

export function isInitialized(target: OnInit): boolean {
  return target._isInitialized !== undefined;
}

export function initialize(instance: object, scope: IContainer) {
  if (!isInitializable(instance) || isInitialized(instance)) {
    return;
  }
  instance._isInitialized = [];
  startAutorun(instance, scope);
}

export function unsubscribeInit(instance: object) {
  if (!isInitializable(instance)) {
    return;
  }
  instance._isInitialized.forEach((s) => s());
  (instance._isInitialized as unknown) = undefined;
}
