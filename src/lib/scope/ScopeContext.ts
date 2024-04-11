import { createContext, useEffect, useMemo } from 'react';
import { IContainer } from 'ts-ioc-container';
import { useContextOrFail } from '../react/context.ts';
import { initialize } from './OnInit.ts';
import { InjectFn } from '@ibabkin/utils';
import { createSubscriptions } from '@lib/scope/Subscriber.ts';
import { invokeCondition } from '@lib/scope/Condition.ts';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

export const useDependency = <T extends object>(fn: InjectFn<IContainer, T>) => {
  const scope = useContextOrFail(ScopeContext);
  const instance = useMemo(() => fn(scope), [scope]);

  useEffect(() => {
    initialize(instance, scope);
    createSubscriptions(instance, scope);
    invokeCondition(instance, scope);
  }, [instance, scope]);

  return instance;
};
