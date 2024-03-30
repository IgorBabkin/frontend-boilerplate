import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { IContainer } from 'ts-ioc-container';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

const parseTags = (tags: string) =>
  tags
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

const createScope = (tags: string[], scope: IContainer): IContainer => scope.createScope(...tags);

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
    () => (current ? createScope(tagsArr, current) : fallback?.(tagsArr)),
    [current, tagsArr, fallback],
  );

  if (scope === undefined) {
    throw new Error('Scope is not defined');
  }

  return <ScopeContext.Provider value={scope}>{children}</ScopeContext.Provider>;
};
