import { hasHooks, Hook, hook, IContainer, IHookContext, runHooks, runHooksAsync } from 'ts-ioc-container';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { toObs$, toRef } from '@lib/observable/utils';
import { addItemToList, subscriptionMetadata } from '@framework/hooks/Metadata';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public';
import { Ref, watch } from 'vue';
import { env, PlayMode } from '@env/IEnv.ts';

export type Unsubscribe = () => void;

const START_KEY = '__start__';
const START_ASYNC_KEY = '__start_async__';
const DISPOSE_KEY = '__dispose__';
export const onStart = (fn: Hook) => hook(START_KEY, fn);
export const onStartAsync = (fn: Hook) => hook(START_ASYNC_KEY, fn);
export const onDispose = (fn: Hook) => hook(DISPOSE_KEY, fn);

const isInitialized = (instance: object) => subscriptionMetadata.has(instance);

export async function initialize(instance: object, scope: IContainer) {
  if (isInitialized(instance)) {
    return;
  }
  subscriptionMetadata.setMetadata(instance, () => []);

  try {
    runHooks(instance, START_KEY, { scope });
    await runHooksAsync(instance, START_ASYNC_KEY, { scope });
  } catch (e) {
    IErrorServiceKey.resolve(scope).throwError(e as Error);
  }
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

export const watchOn =
  (...createList$: ((s: IContainer) => Ref<unknown>)[]): Hook =>
  (context) => {
    const { scope, instance } = context;
    const isReplyMode = env('playMode')(scope) === PlayMode.REPLAY;
    if (isReplyMode) {
      return;
    }
    const args = context.resolveArgs().map(toRef);
    const unwatch = watch([...args, ...createList$.map((c) => c(scope))], (deps) => {
      handleResult(context.invokeMethod({ args: deps.slice(args.length) }), context);
    });
    subscriptionMetadata.setMetadata(instance, addItemToList(unwatch));
  };

export const when = (...conditions: ((s: IContainer) => Promise<unknown>)[]): Hook =>
  subscribeOn({ targets$: conditions.map((c) => (s) => toObs$(c(s))) });
export const whenever = (...conditions: ((s: IContainer) => Promise<unknown>)[]): Hook =>
  watchOn(...conditions.map((c) => (s: IContainer) => toRef(c(s))));

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
