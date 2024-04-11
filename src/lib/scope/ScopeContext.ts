import { createContext, useMemo } from 'react';
import { IContainer } from 'ts-ioc-container';
import { useContextOrFail } from '../react/context.ts';
import { InjectFn } from '@ibabkin/utils';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

export const useDependency = <T extends object>(fn: InjectFn<IContainer, T>) => {
  const scope = useContextOrFail(ScopeContext);
  return useMemo(() => fn(scope), [scope]);
};
