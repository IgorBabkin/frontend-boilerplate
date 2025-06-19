import { type HookFn, IContainer } from 'ts-ioc-container';
import { isUnsubscribable, toObs$, toPromise } from '../../lib/utils';
import { combineLatest, Observable } from 'rxjs';
import { Change, subscriptionMetadata } from '@framework/hooks/Metadata.ts';

export const execute =
  ({
    when = () => Promise.resolve(),
  }: {
    when?: (s: IContainer) => Promise<unknown>;
  } = {}): HookFn =>
  async (context) => {
    await when(context.scope);
    const args = await Promise.all(context.resolveArgs().map(toPromise));
    const result = context.invokeMethod({ args });
    if (isUnsubscribable(result)) {
      subscriptionMetadata.change(context.instance, Change.append(result));
      return;
    }
    await toPromise(result);
  };

export const subscribeOn =
  ({
    when$ = [],
    onError = (e) => console.error(e),
  }: {
    when$?: ((s: IContainer) => Observable<unknown>)[];
    onError?: (e: unknown, scope: IContainer) => void;
  } = {}): HookFn =>
  (context) => {
    const { scope, instance } = context;
    const args = context.resolveArgs().map(toObs$);
    const obs$ = when$.map((c) => c(scope));
    const subscription = combineLatest([...obs$, ...args]).subscribe({
      next: (deps) =>
        toPromise(context.invokeMethod({ args: deps.slice(obs$.length) })).catch((e) => onError(e, scope)),
      error: (e) => onError(e, scope),
      complete: () => {
        subscriptionMetadata.change(instance, Change.delete(subscription));
      },
    });
    subscriptionMetadata.change(instance, Change.append(subscription));
  };
