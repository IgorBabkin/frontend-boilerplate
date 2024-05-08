import { ExecutionContext, IContainer } from 'ts-ioc-container';
import { IErrorBusKey } from '@domain/errors/ErrorBus.ts';
import { combineLatest, Observable } from 'rxjs';
import { promiseToObservable, toObservable } from '@lib/observable/utils.ts';
import { handleResult } from '@lib/initialize/resultHandlers.ts';
import { initializedMetadata } from '@lib/initialize/Metadata.ts';

export const justInvoke = (context: ExecutionContext) => {
  const args = context.resolveArgs();
  try {
    const result = context.invokeMethod({ args });
    handleResult(result, context);
  } catch (e) {
    IErrorBusKey.resolve(context.scope).next(e as Error);
  }
};

export const subscribeOn = (create$?: (s: IContainer) => Observable<unknown>) => (context: ExecutionContext) => {
  const args = context.resolveArgs().map(toObservable);
  const obs$ = create$?.apply(null, [context.scope]);
  const s = combineLatest(obs$ ? [obs$, ...args] : args).subscribe({
    next: ([, ...deps]) => {
      const result = context.invokeMethod({ args: deps });
      handleResult(result, context);
    },
    error: (e) => IErrorBusKey.resolve(context.scope).next(e as Error),
  });
  initializedMetadata.setMetadata(context.instance, (acc) => {
    acc.push(() => s.unsubscribe());
    return acc;
  });
};

export const when = (condition: (s: IContainer) => Promise<unknown>) => (context: ExecutionContext) =>
  subscribeOn(() => promiseToObservable(condition(context.scope)))(context);
