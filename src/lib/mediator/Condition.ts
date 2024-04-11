import { getHooks, hasHooks, hook } from '../hook.ts';
import { type ArgsFn, IContainer } from 'ts-ioc-container';
import { IErrorBusKey } from '@domain/errors/ErrorBus.ts';
import { lastValueFrom, Observable } from 'rxjs';

export const when = (fn: ArgsFn) => hook('when', fn);
export const getConditionHooks = (target: object) => getHooks(target, 'when');

export interface Condition {
  _conditionInvoked: boolean;
}

export function isCondition(target: object): target is Condition {
  return hasHooks(target, 'when');
}

export function isDone(target: Condition): boolean {
  return target._conditionInvoked;
}

export function invokeCondition(instance: object, scope: IContainer) {
  if (!isCondition(instance) || isDone(instance)) {
    return;
  }
  instance._conditionInvoked = true;
  const errorBus$ = IErrorBusKey.resolve(scope);
  for (const [h, argsFn] of getConditionHooks(instance)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fn = instance[h];
    const [obs$] = argsFn(scope) as [Observable<unknown>];
    lastValueFrom(obs$)
      .then((v) => fn.apply(instance, v))
      .catch((e: Error) => errorBus$.next(e));
  }
}
