import { getHooks, hasHooks, hook } from '../hook.ts';
import { type ArgsFn, IContainer } from 'ts-ioc-container';
import { IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';
import { Observable, Subscription } from 'rxjs';

export const subscribeOn = (fn: ArgsFn) => hook('subscribe', fn);
export const getSubscribeHooks = (target: object) => getHooks(target, 'subscribe');

export interface Subscriber {
  _subscriptions: Subscription[];
}

export function isSubscriber(target: object): target is Subscriber {
  return hasHooks(target, 'subscribe');
}

export function isSubscribed(target: Subscriber): boolean {
  return target._subscriptions !== undefined;
}

export function createSubscriptions(instance: object, scope: IContainer) {
  if (!isSubscriber(instance) || isSubscribed(instance)) {
    return;
  }
  instance._subscriptions = [];
  const errorBus$ = IErrorBusKey.resolve(scope);
  for (const [h, argsFn] of getSubscribeHooks(instance)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fn = instance[h];
    const [obs$] = argsFn(scope) as [Observable<unknown>];
    instance._subscriptions.push(
      obs$.subscribe({
        next: (v) => {
          fn.apply(instance, [v]).catch((e: Error) => errorBus$.next(e));
        },
        error: (e: Error) => errorBus$.next(e),
      }),
    );
  }
}

export function unsubscribe(instance: Subscriber) {
  instance._subscriptions.forEach((s) => s.unsubscribe());
  instance._subscriptions = [];
}
