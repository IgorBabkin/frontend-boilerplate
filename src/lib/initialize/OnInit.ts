import { executeHooks, Execution, hasHooks, hook, IContainer } from 'ts-ioc-container';
import { initializedMetadata } from '@lib/initialize/Metadata.ts';

export type Unsubscribe = () => void;

const AUTORUN_KEY = '__autorun__';
export const onStart = (fn: Execution) => hook(AUTORUN_KEY, fn);
export const startAutorun = (instance: object, scope: IContainer) => executeHooks(instance, AUTORUN_KEY, { scope });
export const hasAutorunHooks = (instance: object) => hasHooks(instance, AUTORUN_KEY);

export function initialize(instance: object, scope: IContainer) {
  if (!isInitializable(instance) || isInitialized(instance)) {
    return;
  }
  initializedMetadata.setMetadata(instance, () => []);
  startAutorun(instance, scope);
}

export function unsubscribeInit(instance: object) {
  if (!isInitializable(instance)) {
    return;
  }
  initializedMetadata.getMetadata(instance).forEach((fn) => fn());
  initializedMetadata.deleteMetadata(instance);
}

export function isInitializable(target: object) {
  return hasAutorunHooks(target);
}

export function isInitialized(target: object): boolean {
  return initializedMetadata.hasMetadata(target);
}
