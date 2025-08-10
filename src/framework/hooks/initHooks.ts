import { type HookFn, IContainer } from 'ts-ioc-container';
import { toObs$, toPromise } from '@lib/utils.ts';
import { combineLatest, Observable } from 'rxjs';
import { SUBSCRIPTIONS } from '@framework/hooks/Metadata.ts';

export const execute =
  (...waitFor: (<T>(scope: IContainer) => Observable<T> | Promise<T>)[]): HookFn =>
  async (context) => {
    await Promise.all(waitFor.map((c) => toPromise(c(context.scope))));
    const args = await Promise.all(context.resolveArgs().map(toPromise));
    const result = context.invokeMethod({ args });
    await toPromise(result);
  };

export const subscribeOn =
  (...waitFor: (<T>(scope: IContainer) => Observable<T> | Promise<T>)[]): HookFn =>
  (context) => {
    const { scope, instance } = context;
    const args = context.resolveArgs().map(toObs$);
    const waitsFor$ = waitFor.map((c) => toObs$(c(context.scope)));
    const subscription = combineLatest([...waitsFor$, ...args]).subscribe({
      next: (deps) =>
        toPromise(context.invokeMethod({ args: deps.slice(waitsFor$.length) })).catch((e) => onError(e, scope)),
      error: (e) => onError(e, scope),
      complete: () => {
        const current = SUBSCRIPTIONS.getSubscriptions(instance) ?? [];
        SUBSCRIPTIONS.set(
          instance,
          current.filter((s) => s !== subscription),
        );
      },
    });
    const current = SUBSCRIPTIONS.getSubscriptions(instance) ?? [];
    SUBSCRIPTIONS.set(instance, [...current, subscription]);
  };
