import { PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { IContainer } from 'ts-ioc-container';
import { parseTags } from '../utils.ts';
import { ScopeNotFoundError } from './ScopeNotFoundError.ts';
import { ScopeContext } from './ScopeContext.ts';

function Scope({
  fallback,
  tags = '',
  children,
}: PropsWithChildren<{
  fallback?: (tags: string[]) => IContainer;
  tags?: string;
}>) {
  const current = useContext(ScopeContext);
  const tagsArr = useMemo(() => parseTags(tags), [tags]);
  const scope = useMemo(
    () => (current ? current.createScope(...tagsArr) : fallback?.(tagsArr)),
    [current, tagsArr, fallback],
  );

  if (scope === undefined) {
    throw new ScopeNotFoundError('Scope is not defined');
  }

  useEffect(() => {
    return () => {
      scope.dispose();
    };
  }, [scope]);

  return <ScopeContext.Provider value={scope}>{children}</ScopeContext.Provider>;
}

export default Scope;
