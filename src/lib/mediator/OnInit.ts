import { getHooks, hasHooks, hook } from '../hook.ts';
import { IContainer } from 'ts-ioc-container';
import { IErrorBusKey } from '@domain/errors/ErrorBus.ts';
import { Subscription } from 'rxjs';

export const onInit = hook('onInit');
export const getOnInitHooks = (target: object) => getHooks(target, 'onInit');

export interface OnInit {
  _isInitialized: Subscription[];
}

export function isInitializable(target: object): target is OnInit {
  return hasHooks(target, 'onInit');
}

export function isInitialized(target: OnInit): boolean {
  return target._isInitialized !== undefined;
}

export function initialize(instance: object, scope: IContainer) {
  if (!isInitializable(instance) || isInitialized(instance)) {
    return;
  }
  instance._isInitialized = [];
  const errorBus$ = IErrorBusKey.resolve(scope);
  for (const [h, argsFn] of getOnInitHooks(instance)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fn = instance[h];
    fn.apply(instance, argsFn(scope))
      .then((result: unknown) => {
        if (result instanceof Subscription) {
          instance._isInitialized.push(result);
        }
      })
      .catch((e: Error) => errorBus$.next(e));
  }
}

export function unsubscribeInit(instance: object) {
  if (!isInitializable(instance)) {
    return;
  }
  instance._isInitialized.forEach((s) => s.unsubscribe());
  instance._isInitialized = [];
}
