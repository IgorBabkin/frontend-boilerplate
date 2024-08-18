import { hasHooks, Hook, hook, IContainer, IHookContext, runHooks, runHooksAsync } from 'ts-ioc-container';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { toObs$ } from '@lib/observable/utils';
import { addItemToList, subscriptionMetadata } from '@framework/hooks/Metadata';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public';
import { env, PlayMode } from '@env/IEnv.ts';
import { Identifier } from '@lib/types.ts';
import { EntityPatch, patchSubject } from '@context/EntityPatch.ts';

export type Unsubscribe = () => void;

const INIT_KEY = '__init__';
const INIT_ASYNC_KEY = '__init_async__';
export const onInit = (fn: Hook) => hook(INIT_KEY, fn);
export const onInitAsync = (fn: Hook) => hook(INIT_ASYNC_KEY, fn);

const CONSTRUCT_KEY = '__construct__';
const CONSTRUCT_ASYNC_KEY = '__construct_async__';
export const onConstruct = (fn: Hook) => hook(CONSTRUCT_KEY, fn);
export const onConstructAsync = (fn: Hook) => hook(CONSTRUCT_ASYNC_KEY, fn);

const DISPOSE_KEY = '__dispose__';
export const onDispose = (fn: Hook) => hook(DISPOSE_KEY, fn);

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
  subscriptionMetadata.setMetadata(instance, () => []);

  runHooks(instance, INIT_KEY, { scope });
  if ('init' in instance) {
    (instance as { init: () => void }).init();
  }

  await Promise.all([
    runHooksAsync(instance, INIT_ASYNC_KEY, { scope }),
    'initAsync' in instance ? (instance as { initAsync: () => void }).initAsync() : Promise.resolve(),
  ]);
}

export function unsubscribeInit(instance: object) {
  (subscriptionMetadata.getMetadata(instance) ?? []).forEach((fn) => fn.unsubscribe());
  subscriptionMetadata.delete(instance);
}

export function dispose(instance: object, scope: IContainer) {
  if (!hasHooks(instance, DISPOSE_KEY)) {
    return;
  }

  try {
    runHooks(instance, DISPOSE_KEY, { scope });
  } catch (e) {
    IErrorServiceKey.resolve(scope).throwError(e as Error);
  }
}

export const execute = () => (context: IHookContext) => {
  const { scope } = context;
  const isReplyMode = env('playMode')(scope) === PlayMode.REPLAY;
  if (isReplyMode) {
    return;
  }

  try {
    handleResult(context.invokeMethod({ args: context.resolveArgs() }), context);
  } catch (e) {
    IErrorServiceKey.resolve(scope).throwError(e as Error);
  }
};

const defaultErrorHandler = (e: unknown, scope: IContainer) => IErrorServiceKey.resolve(scope).throwError(e as Error);

export const subscribeOn =
  ({
    targets$ = [],
    onError = defaultErrorHandler,
  }: {
    targets$?: ((s: IContainer) => Observable<unknown>)[];
    onError?: (e: unknown, scope: IContainer) => void;
  } = {}): Hook =>
  (context) => {
    const { scope, instance } = context;
    const isReplyMode = env('playMode')(scope) === PlayMode.REPLAY;
    if (isReplyMode) {
      return;
    }
    const args = context.resolveArgs().map(toObs$);
    const obs$ = targets$.map((c) => c(scope));
    const subscription = combineLatest([...obs$, ...args]).subscribe({
      next: (deps) => handleResult(context.invokeMethod({ args: deps.slice(obs$.length) }), context),
      error: (e) => onError(e, scope),
      complete: () => {
        subscriptionMetadata.setMetadata(instance, (items) => items.filter((s) => s !== subscription));
      },
    });
    subscriptionMetadata.setMetadata(instance, addItemToList(subscription));
  };

export const when = (...conditions: ((s: IContainer) => Promise<unknown>)[]): Hook =>
  subscribeOn({ targets$: conditions.map((c) => (s) => toObs$(c(s))) });

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
    subscriptionMetadata.setMetadata(context.instance, (subscriptions) => {
      subscriptions.push(result);
      return subscriptions;
    });
    return;
  }
};

export type SourceEventOptions<T extends Identifier> = { src: (s: IContainer) => Observable<EntityPatch<T>> };
export const sourceEvents =
  <T extends Identifier>({ src }: SourceEventOptions<T>): Hook =>
  (context) => {
    const state$ = context.getProperty() as BehaviorSubject<T[]>;
    const subscription = src(context.scope).subscribe({
      next: (current) => patchSubject(state$, current),
      error: (e) => state$.error(e),
    });
    subscriptionMetadata.setMetadata(context.instance, (subscriptions) => {
      subscriptions.push(subscription);
      return subscriptions;
    });
  };
