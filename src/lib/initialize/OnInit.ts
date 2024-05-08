import { executeHooks, Execution, ExecutionContext, hasHooks, hook, IContainer } from 'ts-ioc-container';
import { initializedMetadata } from '@lib/initialize/Metadata.ts';
import { Observable } from 'rxjs';
import { IErrorBusKey } from '@domain/errors/ErrorBus.ts';
import { promiseToObservable } from '@lib/observable/utils.ts';
import { doIt, subscribe } from '@lib/initialize/strategies.ts';
import { handleArray, handlePromise, handleSubscription } from '@lib/initialize/resultHandlers.ts';

export type Unsubscribe = () => void;

const AUTORUN_KEY = '__autorun__';
export const onStart = (fn: Execution) => hook(AUTORUN_KEY, fn);

export function initialize(instance: object, scope: IContainer) {
  if (!hasHooks(instance, AUTORUN_KEY) || initializedMetadata.hasMetadata(instance)) {
    return;
  }
  initializedMetadata.setMetadata(instance, () => []);
  executeHooks(instance, AUTORUN_KEY, { scope });
}

export function unsubscribeInit(instance: object) {
  if (!hasHooks(instance, AUTORUN_KEY)) {
    return;
  }
  initializedMetadata.getMetadata(instance).forEach((fn) => fn());
  initializedMetadata.deleteMetadata(instance);
}

const handleResult = (result: unknown, context: ExecutionContext) => {
  const thenPromise = handlePromise(context);
  const thenSubscription = handleSubscription(context);
  const thenArray = handleArray(context);

  const restart = handleResult;
  thenArray({ then: thenPromise({ then: thenSubscription({}), restart }), restart })(result);
};

export const justInvoke = (context: ExecutionContext) => {
  doIt({
    handleError: (e: Error, s: IContainer) => IErrorBusKey.resolve(s).next(e),
    handleResult,
  })(context);
};

export const subscribeOn = (create$?: (s: IContainer) => Observable<unknown>) =>
  subscribe({
    create$,
    handleError: (e: Error, s: IContainer) => IErrorBusKey.resolve(s).next(e),
    handleResult,
    saveUnsubscribe: (instance, u) => initializedMetadata.setMetadata(instance, (acc) => acc.concat(u)),
  });

export const when =
  (condition: (s: IContainer) => Promise<unknown>): Execution =>
  (context) =>
    subscribeOn(() => promiseToObservable(condition(context.scope)))(context);
