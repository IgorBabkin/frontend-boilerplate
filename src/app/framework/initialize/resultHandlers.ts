import { IHookContext } from 'ts-ioc-container';
import { IErrorBusKey } from '@modules/errors/ErrorBus';
import { Subscription } from 'rxjs';
import { disposeMetadata } from '@framework/initialize/Metadata';

export type HandleResult = (result: unknown, context: IHookContext) => void;

export type HandleContext = {
  restart: HandleResult;
  then?: HandleResult;
};

export const handlePromise =
  (context: IHookContext) =>
  ({ restart, then = () => ({}) }: HandleContext) =>
  (result: unknown) => {
    if (result instanceof Promise) {
      result.then((r) => restart(r, context)).catch((e: Error) => IErrorBusKey.resolve(context.scope).next(e));
      return;
    }

    then(result, context);
  };

export const handleSubscription =
  (context: IHookContext) =>
  ({ then = () => ({}) }: Pick<HandleContext, 'then'>) =>
  (result: unknown) => {
    if (result instanceof Subscription) {
      disposeMetadata.setMetadata(context.instance, (acc) => {
        acc.push(() => result.unsubscribe());
        return acc;
      });
      return;
    }

    then(result, context);
  };

export const handleArray =
  (context: IHookContext) =>
  ({ restart, then = () => ({}) }: HandleContext) =>
  (result: unknown) => {
    if (result instanceof Array) {
      result.forEach((r) => restart(r, context));
      return;
    }

    then(result, context);
  };
