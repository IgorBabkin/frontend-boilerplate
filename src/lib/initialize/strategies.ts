import { Execution, ExecutionContext, IContainer } from 'ts-ioc-container';
import { combineLatest, Observable } from 'rxjs';
import { Unsubscribe } from '@lib/initialize/OnInit.ts';
import { toObservable } from '@lib/observable/utils.ts';

export const doIt =
  ({
    handleError,
    handleResult,
  }: {
    handleError: (e: Error, s: IContainer) => void;
    handleResult: (result: unknown, context: ExecutionContext) => void;
  }): Execution =>
  (context) => {
    const args = context.resolveArgs();
    try {
      const result = context.invokeMethod({ args });
      handleResult(result, context);
    } catch (e) {
      handleError(e as Error, context.scope);
    }
  };

export const subscribe =
  ({
    create$,
    handleError,
    handleResult,
    saveUnsubscribe,
  }: {
    create$?: (s: IContainer) => Observable<unknown>;
    handleError: (e: Error, s: IContainer) => void;
    handleResult: (r: unknown, c: ExecutionContext) => void;
    saveUnsubscribe: (instance: object, u: Unsubscribe) => void;
  }): Execution =>
  (context) => {
    const args = context.resolveArgs().map(toObservable);
    const obs$ = create$?.apply(null, [context.scope]);
    const s = combineLatest(obs$ ? [obs$, ...args] : args).subscribe({
      next: (deps) => handleResult(context.invokeMethod({ args: obs$ ? deps.slice(1) : deps }), context),
      error: (e) => handleError(e, context.scope),
    });
    saveUnsubscribe(context.instance, () => s.unsubscribe());
  };
