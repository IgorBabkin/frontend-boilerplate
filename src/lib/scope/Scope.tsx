import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { IContainer } from 'ts-ioc-container';
import { parseTags } from '../utils.ts';
import { ContextNotFoundError } from '../react/ContextNotFoundError.ts';
import { unsubscribeInit } from '@lib/initialize/OnInit.ts';
import { InjectFn } from '@ibabkin/utils';
import { useContextOrFail } from '@lib/react/context.ts';

export type IScopeProps = {
  tags?: string;
  fallback?: (tags: string[]) => IContainer;
};

function Scope({ fallback, tags = '', children }: PropsWithChildren<IScopeProps>) {
  const current = useContext(ScopeContext);
  const tagsArr = useMemo(() => parseTags(tags), [tags]);
  const scope = useMemo(
    () => (current ? current.createScope(...tagsArr) : fallback?.(tagsArr)),
    [current, tagsArr, fallback],
  );

  if (scope === undefined) {
    throw new ContextNotFoundError('Scope is not defined');
  }

  useEffect(() => {
    return () => {
      for (const instance of scope.getInstances() as object[]) {
        unsubscribeInit(instance);
      }
      if (scope.isDisposed) return;
      scope.dispose();
    };
  }, [scope]);

  return <ScopeContext.Provider value={scope}>{children}</ScopeContext.Provider>;
}

export const ScopeContext = createContext<IContainer | undefined>(undefined);
export const useDependency = <T extends object>(fn: InjectFn<IContainer, T>) => {
  const scope = useContextOrFail(ScopeContext);
  return useMemo(() => fn(scope), [scope]);
};

export default Scope;
