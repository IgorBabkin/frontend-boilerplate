import { executeHooks, Execution, ExecutionContext, hasHooks, hook, IContainer } from 'ts-ioc-container';
import { Observable } from 'rxjs';
import { IErrorBusKey } from '@domain/errors/ErrorBus.ts';
import { promiseToObservable } from '@lib/observable/utils.ts';
import { invokeExecution, subscribeToExecution } from '@lib/initialize/strategies.ts';
import { handleArray, handlePromise, HandleResult, handleSubscription } from '@lib/initialize/resultHandlers.ts';

export type Unsubscribe = () => void;

const AUTORUN_KEY = '__autorun__';
const DISPOSE_KEY = '__dispose__';
export const onStart = (fn: Execution) => hook(AUTORUN_KEY, fn);
export const onDispose = (fn: Execution) => hook(DISPOSE_KEY, fn);

export function initialize(instance: object, scope: IContainer) {
  if (!hasHooks(instance, AUTORUN_KEY) || AUTORUN_KEY in instance) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  instance[AUTORUN_KEY] = [];
  executeHooks(instance, AUTORUN_KEY, { scope });
}

export function unsubscribeInit(instance: object) {
  if (!hasHooks(instance, AUTORUN_KEY)) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  instance[AUTORUN_KEY].forEach((fn: Unsubscribe) => fn());
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete instance[AUTORUN_KEY];
}

export function dispose(instance: object, scope: IContainer) {
  if (!hasHooks(instance, DISPOSE_KEY)) {
    return;
  }
  executeHooks(instance, DISPOSE_KEY, { scope });
}

const hr = ({ then }: { then?: HandleResult } = {}) => {
  return (result: unknown, context: ExecutionContext) => {
    const restart = hr({ then });
    const thenPromise = handlePromise(context);
    const thenSubscription = handleSubscription(context);
    const thenArray = handleArray(context);

    thenArray({ then: thenPromise({ then: thenSubscription({ then }), restart }), restart })(result);
  };
};

export const execute =
  ({ handleResult: then }: { handleResult?: HandleResult } = {}) =>
  (context: ExecutionContext) => {
    invokeExecution({
      handleError: (e: Error, s: IContainer) => IErrorBusKey.resolve(s).next(e),
      handleResult: hr({ then }),
    })(context);
  };

export const subscribeOn = (
  create$?: (s: IContainer) => Observable<unknown>,
  map?: (instance: Observable<unknown[]>, context: ExecutionContext) => Observable<unknown[]>,
) =>
  subscribeToExecution({
    create$,
    handleError: (e: Error, s: IContainer) => IErrorBusKey.resolve(s).next(e),
    handleResult: hr(),
    saveUnsubscribe: (instance, u) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance[AUTORUN_KEY].push(u);
    },
    map,
  });

export const when =
  (
    condition: (s: IContainer) => Promise<unknown>,
    map?: (instance: Observable<unknown[]>) => Observable<unknown[]>,
  ): Execution =>
  (context) =>
    subscribeOn(() => promiseToObservable(condition(context.scope)), map)(context);
