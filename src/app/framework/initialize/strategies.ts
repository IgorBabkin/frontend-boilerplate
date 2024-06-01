import { constructor, Hook, IHookContext, IContainer, resolveArgs } from 'ts-ioc-container';
import { combineLatest, Observable } from 'rxjs';
import { Unsubscribe } from '@framework/initialize/OnInit';

export const subscribeToExecution =
  ({
    create$,
    handleError,
    handleResult,
    saveUnsubscribe,
    map = (x: Observable<unknown[]>) => x,
  }: {
    create$?: (s: IContainer) => Observable<unknown>;
    handleError: (e: Error, s: IContainer) => void;
    handleResult: (r: unknown, c: IHookContext) => void;
    saveUnsubscribe: (instance: object, u: Unsubscribe) => void;
    map?: (instance: Observable<unknown[]>, context: IHookContext) => Observable<unknown[]>;
  }): Hook =>
  (context) => {
    const args = resolveArgs(
      context.instance.constructor as constructor<unknown>,
      context.methodName as string,
    )(context.scope);
    const obs$ = create$?.apply(null, [context.scope]);
    const s = map(combineLatest(obs$ ? [obs$, ...args] : args), context).subscribe({
      next: (deps) => handleResult(context.invokeMethod({ args: obs$ ? deps.slice(1) : deps }), context),
      error: (e) => handleError(e, context.scope),
    });
    saveUnsubscribe(context.instance, () => s.unsubscribe());
  };
