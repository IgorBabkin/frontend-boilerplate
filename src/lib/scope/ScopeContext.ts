import { createContext, useEffect, useMemo } from 'react';
import { IContainer } from 'ts-ioc-container';
import { useContextOrFail } from '../react/context.ts';
import { initialize, isInitializable, isInitialized } from './OnInit.ts';
import { InjectFn } from '@ibabkin/utils';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

export const useDependency = <T extends object>(fn: InjectFn<IContainer, T>) => {
  const scope = useContextOrFail(ScopeContext);
  const instance = useMemo(() => fn(scope), [scope]);

  useEffect(() => {
    if (isInitializable(instance) && !isInitialized(instance)) {
      initialize(instance, scope);
    }
  }, [instance, scope]);

  return instance;
};
