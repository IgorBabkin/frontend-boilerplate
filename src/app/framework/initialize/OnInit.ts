import {
  Hook,
  IHookContext,
  hasHooks,
  hook,
  IContainer,
  runHooksAsync,
  invokeExecution,
  runHooks,
} from 'ts-ioc-container';
import { Observable } from 'rxjs';
import { promiseToObservable } from '@core/observable/utils';
import { subscribeToExecution } from '@framework/initialize/strategies';
import { handleArray, handlePromise, HandleResult, handleSubscription } from '@framework/initialize/resultHandlers';
import { addItemToList, disposeMetadata } from '@framework/initialize/Metadata';
import { IErrorBusKey } from '@modules/errors/ErrorBus';

export type Unsubscribe = () => void;

const START_KEY = '__start__';
const DISPOSE_KEY = '__dispose__';
export const onStart = (fn: Hook) => hook(START_KEY, fn);
export const onDispose = (fn: Hook) => hook(DISPOSE_KEY, fn);

export function initialize(instance: object, scope: IContainer) {
  if (!disposeMetadata.has(instance)) {
    return;
  }
  disposeMetadata.setMetadata(instance, () => []);

  try {
    void runHooksAsync(instance, START_KEY, { scope }).catch((e) => IErrorBusKey.resolve(scope).next(e));
  } catch (e) {
    IErrorBusKey.resolve(scope).next(e as Error);
  }
}

export function unsubscribeInit(instance: object) {
  if (!hasHooks(instance, START_KEY)) {
    return;
  }
  (disposeMetadata.getMetadata(instance) ?? []).forEach((fn) => fn());
  disposeMetadata.delete(instance);
}

export function dispose(instance: object, scope: IContainer) {
  if (!hasHooks(instance, DISPOSE_KEY)) {
    return;
  }

  try {
    runHooks(instance, DISPOSE_KEY, { scope });
  } catch (e) {
    IErrorBusKey.resolve(scope).next(e as Error);
  }
}

const hr = ({ then }: { then?: HandleResult } = {}) => {
  return (result: unknown, context: IHookContext) => {
    const restart = hr({ then });
    const thenPromise = handlePromise(context);
    const thenSubscription = handleSubscription(context);
    const thenArray = handleArray(context);

    thenArray({ then: thenPromise({ then: thenSubscription({ then }), restart }), restart })(result);
  };
};

export const execute =
  ({ handleResult: then }: { handleResult?: HandleResult } = {}) =>
  (context: IHookContext) => {
    invokeExecution({
      handleResult: hr({ then }),
    })(context);
  };

export const subscribeOn = (
  create$?: (s: IContainer) => Observable<unknown>,
  map?: (instance: Observable<unknown[]>, context: IHookContext) => Observable<unknown[]>,
) =>
  subscribeToExecution({
    create$,
    handleError: (e: Error, s: IContainer) => IErrorBusKey.resolve(s).next(e),
    handleResult: hr(),
    saveUnsubscribe: (instance, u) => disposeMetadata.setMetadata(instance, addItemToList(u)),
    map,
  });

export const when =
  (
    condition: (s: IContainer) => Promise<unknown>,
    map?: (instance: Observable<unknown[]>) => Observable<unknown[]>,
  ): Hook =>
  (context) =>
    subscribeOn(() => promiseToObservable(condition(context.scope)), map)(context);
