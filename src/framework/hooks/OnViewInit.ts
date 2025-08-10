import { getHooks, hook, HookFn, runHooksAsync } from 'ts-ioc-container';
import { SUBSCRIPTIONS } from '@framework/hooks/Metadata';
import { constructor } from 'ts-ioc-container/typings/utils';
import { HookClass } from 'ts-ioc-container/typings/hooks/hook';
import { ScopeContext, useDep } from '@helpers/scope/ScopeContext.ts';
import { useContextOrFail } from '@lib/react/context.ts';
import { useMemo } from 'react';
import { ControllerMediator } from '@framework/hooks/ControllerMediator.ts';

export const VMAction = hook('VMAction');

const getActionList = (target: object) => {
  const hooks = getHooks(target, 'VMAction');
  return hooks.keys();
};

export type Unsubscribe = () => void;
export const onViewInit = (...fn: (HookFn | constructor<HookClass>)[]) => hook('onViewInit', ...fn);

export function useWidgetController<T>(target: constructor<T>) {
  const controller = useDep(target);
  const scope = useContextOrFail(ScopeContext);

  if (!SUBSCRIPTIONS.has(target)) {
    SUBSCRIPTIONS.set(controller as object, []);
    runHooksAsync(controller as object, 'onViewInit', { scope }).catch((e) => {
      console.error('Error during controller initialization:', e);
    });
  }

  const mediator = useDep(ControllerMediator);
  return useMemo(() => {
    return new Proxy(controller as object, {
      get: (target, prop) => {
        const actions = Array.from(getActionList(target));
        if (typeof prop === 'string' && actions.includes(prop)) {
          return (...args: unknown[]) => mediator.send(target, prop, ...args);
        }
        return target[prop];
      },
    });
  }, [controller, mediator]);
}
