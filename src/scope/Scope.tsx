import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { IContainer } from 'ts-ioc-container';
import { parseTags } from '../utils.ts';
import { IErrorBus, IErrorBusKey } from '../ErrorBus.ts';
import { ScopeMediator } from './ScopeMediator.ts';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

export const Scope = ({
  fallback,
  tags = '',
  children,
}: PropsWithChildren<{
  fallback?: (tags: string[]) => IContainer;
  tags?: string;
}>) => {
  const current = useContext(ScopeContext);
  const tagsArr = useMemo(() => parseTags(tags), [tags]);
  const scope = useMemo(
    () => (current ? current.createScope(...tagsArr) : fallback?.(tagsArr)),
    [current, tagsArr, fallback],
  );

  if (scope === undefined) {
    throw new Error('Scope is not defined');
  }

  const mediator = useMemo(() => scope.resolve(ScopeMediator, { args: [tags] }), [scope, tags]);
  const errorBus$ = useMemo(() => scope.resolve<IErrorBus>(IErrorBusKey), [scope]);

  useEffect(() => {
    mediator.start().catch((e) => errorBus$.next(e));
    return () => scope.dispose();
  }, [scope, mediator, errorBus$]);

  return <ScopeContext.Provider value={scope}>{children}</ScopeContext.Provider>;
};
