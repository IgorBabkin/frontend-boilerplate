import { hasHooks, Hook, hook, IContainer, IHookContext, runHooks, runHooksAsync } from 'ts-ioc-container';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { toObs$ } from '@lib/observable/utils';
import { addItemToList, disposeMetadata } from '@framework/hooks/Metadata';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public';

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
    void runHooksAsync(instance, START_KEY, { scope }).catch((e) => {
      IErrorServiceKey.resolve(scope).throwError(e);
    });
  } catch (e) {
    IErrorServiceKey.resolve(scope).throwError(e as Error);
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
    IErrorServiceKey.resolve(scope).throwError(e as Error);
  }
}

export const execute = () => (context: IHookContext) => {
  try {
    handleResult(context.invokeMethod({ args: context.resolveArgs() }), context);
  } catch (e) {
    IErrorServiceKey.resolve(context.scope).throwError(e as Error);
  }
};

export const subscribeOn =
  (create$?: (s: IContainer) => Observable<unknown>): Hook =>
  (context) => {
    const args = context.resolveArgs();
    const obs$ = create$?.apply(null, [context.scope]);
    const subscription = combineLatest(obs$ ? [obs$, ...args] : args).subscribe({
      next: (deps) => handleResult(context.invokeMethod({ args: obs$ ? deps.slice(1) : deps }), context),
      error: (e) => IErrorServiceKey.resolve(context.scope).throwError(e),
    });
    disposeMetadata.setMetadata(
      context.instance,
      addItemToList(() => subscription.unsubscribe()),
    );
  };

export const when = (condition: (s: IContainer) => Promise<unknown>): Hook => subscribeOn((s) => toObs$(condition(s)));

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
    disposeMetadata.setMetadata(context.instance, (acc) => {
      acc.push(() => result.unsubscribe());
      return acc;
    });
    return;
  }
};
