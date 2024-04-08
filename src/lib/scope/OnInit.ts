import { getHooks, hasHooks, hook } from '../hook.ts';
import { IContainer } from 'ts-ioc-container';
import { IErrorBus, IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';

export const onInit = hook('onInit');
export const getOnInitHooks = (target: object): string[] => getHooks(target, 'onInit') ?? [];

export interface OnInit {
  _isInitialized: boolean;
}

export function isInitializable(target: object): target is OnInit {
  return hasHooks(target, 'onInit');
}

export function isInitialized(target: OnInit): boolean {
  return target._isInitialized;
}

export function initialize(instance: OnInit, scope: IContainer) {
  instance._isInitialized = true;
  const errorBus$ = scope.resolve<IErrorBus>(IErrorBusKey);
  for (const h of getOnInitHooks(instance)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fn = instance[h];
    fn.call(instance).catch((e: Error) => errorBus$.next(e));
  }
}
