import { ExecutionContext } from 'ts-ioc-container';
import { IErrorBusKey } from '@domain/errors/ErrorBus.ts';
import { Subscription } from 'rxjs';
import { OnInit } from '@lib/initialize/OnInit.ts';

type HandleResult = (result: unknown, context: ExecutionContext) => void;

type HandleContext = {
  restart: HandleResult;
  then?: HandleResult;
};

const handlePromise =
  ({ restart, then = () => ({}) }: HandleContext) =>
  (result: unknown, context: ExecutionContext) => {
    if (result instanceof Promise) {
      result.then((r) => restart(r, context)).catch((e: Error) => IErrorBusKey.resolve(context.scope).next(e));
      return;
    }

    then(result, context);
  };

const handleSubscription =
  ({ then = () => ({}) }: Pick<HandleContext, 'then'>) =>
  (result: unknown, context: ExecutionContext) => {
    if (result instanceof Subscription) {
      (context.instance as OnInit)._isInitialized.push(() => result.unsubscribe());
      return;
    }

    then(result, context);
  };

const handleArray =
  ({ restart, then = () => ({}) }: HandleContext) =>
  (result: unknown, context: ExecutionContext) => {
    if (result instanceof Array) {
      result.forEach((r) => restart(r, context));
      return;
    }

    then(result, context);
  };

export const handleResult = (result: unknown, context: ExecutionContext) => {
  handleArray({ then: handlePromise({ then: handleSubscription({}), restart: handleResult }), restart: handleResult })(
    result,
    context,
  );
};
