import { HookFn, hook, IContainer, IHookContext, runHooks, runHooksAsync } from 'ts-ioc-container';
import { mergeMap, Observable, Subject, Subscription, Unsubscribable } from 'rxjs';
import { subscriptionMetadata } from '@framework/hooks/Metadata';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public';

export const useRepoMessage = <TPayload, TResult>(fn: (creds: TPayload) => Observable<TResult>) => {
  const action$ = new Subject<TPayload>();
  const result$ = action$.asObservable().pipe(mergeMap((v) => fn(v)));
  return [action$, result$];
};

export type SubscribeOn<Result> = (c: IContainer) => Observable<Result>;
export type Method<Payload, Result> = (payload: Payload) => Result;
export const action = <Payload, Result>(
  method: Method<Payload, Result>,
  value: { subscribeOn?: ((c: IContainer) => Observable<unknown>)[] } = {},
): Method<Payload, Result> => {
  Object.defineProperty(method, '__subscribe_on__', value.subscribeOn ?? []);
  return method;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const getSubscribeOn = (method: Function): SubscribeOn<unknown> | undefined => {
  return method['__subscribe_on__'];
};

export type Unsubscribe = () => void;

const INIT_KEY = '__init__';
const INIT_ASYNC_KEY = '__init_async__';
export const onInit = (...fn: HookFn[]) => hook(INIT_KEY, ...fn);
export const onInitAsync = (...fn: HookFn[]) => hook(INIT_ASYNC_KEY, ...fn);

const DISPOSE_KEY = '__dispose__';
export const onDispose = (...fn: HookFn[]) => hook(DISPOSE_KEY, ...fn);

export const isInitialized = (instance: object) => subscriptionMetadata.has(instance);

/**
 * It's should be covered to try/catch block
 * @param instance
 * @param scope
 * @throws Error
 */
export async function initialize(instance: object, scope: IContainer) {
  if (isInitialized(instance)) {
    return;
  }

  for (const method of Object.values(instance)) {
    const subscribeOn = getSubscribeOn(method);
    if (subscribeOn) {
      const subscription = subscribeOn(scope).subscribe({
        next: (v) => method.call(instance, v),
      });
      subscriptionMetadata.change(instance, (subscriptions) => subscriptions.concat(subscription));
    }
  }

  runHooks(instance, INIT_KEY, { scope });
  if ('init' in instance) {
    const result = (instance as { init: () => void | Unsubscribable }).init();
    if (result instanceof Subscription) {
      subscriptionMetadata.change(instance, (subscriptions) => subscriptions.concat(result));
    }
  }

  await Promise.all([
    runHooksAsync(instance, INIT_ASYNC_KEY, { scope }),
    'initAsync' in instance ? (instance as { initAsync: () => void }).initAsync() : Promise.resolve(),
  ]);
}

export function dispose(instance: object) {
  subscriptionMetadata.getMetadata(instance)?.forEach((s) => s.unsubscribe());
  subscriptionMetadata.delete(instance);
}

export type HandleResult = (result: unknown, context: IHookContext) => void;

export const handleResult: HandleResult = (result, context) => {
  if (result instanceof Array) {
    result.forEach((r) => handleResult(r, context));
    return;
  }

  if (result instanceof Promise) {
    result
      .then((r) => handleResult(r, context))
      .catch((e: Error) => IErrorServiceKey.resolve(context.scope).throwError(e));
    return;
  }

  if (result instanceof Subscription) {
    subscriptionMetadata.change(context.instance, (subscriptions) => {
      subscriptions.push(result);
      return subscriptions;
    });
    return;
  }
};
