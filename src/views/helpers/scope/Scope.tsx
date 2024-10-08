import { PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { IContainer } from 'ts-ioc-container';
import { parseTags } from '@lib/utils.ts';
import { ContextNotFoundError } from '@lib/react/ContextNotFoundError.ts';
import { disposeScope, ScopeContext } from './ScopeContext.ts';
import { initialize } from '@framework/hooks/OnInit.ts';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';

export type IScopeProps = {
  tags?: string;
  fallback?: (tags: string[]) => IContainer;
  createScope: (parent: IContainer, tags: string[]) => IContainer;
};

function Scope({ fallback, tags = '', children, createScope }: PropsWithChildren<IScopeProps>) {
  const current = useContext(ScopeContext);
  const tagsArr = useMemo(() => parseTags(tags), [tags]);
  const scope = useMemo(
    () => (current ? createScope(current, tagsArr) : fallback?.(tagsArr)),
    [current, tagsArr, fallback, createScope],
  );

  if (scope === undefined) {
    throw new ContextNotFoundError('Scope is not defined');
  }

  useEffect(() => {
    for (const [, instance] of scope.resolveManyByAlias((s) => s.has('required'))) {
      initialize(instance as object, scope).catch((e) => IErrorServiceKey.resolve(scope).throwError(e as Error));
    }
    return () => disposeScope(scope);
  }, [scope]);

  return <ScopeContext.Provider value={scope}>{children}</ScopeContext.Provider>;
}

export default Scope;
