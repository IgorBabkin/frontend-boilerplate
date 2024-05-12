import { ExecutionContext } from 'ts-ioc-container';
import { IErrorBusKey } from '@domain/errors/ErrorBus.ts';
import { Subscription } from 'rxjs';
import { initializedMetadata } from '@lib/initialize/Metadata.ts';

export type HandleResult = (result: unknown, context: ExecutionContext) => void;

export type HandleContext = {
  restart: HandleResult;
  then?: HandleResult;
};

export const handlePromise =
  (context: ExecutionContext) =>
  ({ restart, then = () => ({}) }: HandleContext) =>
  (result: unknown) => {
    if (result instanceof Promise) {
      result.then((r) => restart(r, context)).catch((e: Error) => IErrorBusKey.resolve(context.scope).next(e));
      return;
    }

    then(result, context);
  };

export const handleSubscription =
  (context: ExecutionContext) =>
  ({ then = () => ({}) }: Pick<HandleContext, 'then'>) =>
  (result: unknown) => {
    if (result instanceof Subscription) {
      initializedMetadata.setMetadata(context.instance, (acc) => {
        acc.push(() => result.unsubscribe());
        return acc;
      });
      return;
    }

    then(result, context);
  };

export const handleArray =
  (context: ExecutionContext) =>
  ({ restart, then = () => ({}) }: HandleContext) =>
  (result: unknown) => {
    if (result instanceof Array) {
      result.forEach((r) => restart(r, context));
      return;
    }

    then(result, context);
  };
