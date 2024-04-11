import { getHooks, hasHooks, hook } from '../hook.ts';
import { IContainer } from 'ts-ioc-container';
import { IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';

export const onInit = hook('onInit');
export const getOnInitHooks = (target: object) => getHooks(target, 'onInit');

export interface OnInit {
  _isInitialized: boolean;
}

export function isInitializable(target: object): target is OnInit {
  return hasHooks(target, 'onInit');
}

export function isInitialized(target: OnInit): boolean {
  return target._isInitialized;
}

export function initialize(instance: object, scope: IContainer) {
  if (!isInitializable(instance) || isInitialized(instance)) {
    return;
  }
  instance._isInitialized = true;
  const errorBus$ = IErrorBusKey.resolve(scope);
  for (const [h, argsFn] of getOnInitHooks(instance)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fn = instance[h];
    fn.apply(instance, argsFn(scope)).catch((e: Error) => errorBus$.next(e));
  }
}
