import { PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { IContainer } from 'ts-ioc-container';
import { parseTags } from '../utils.ts';
import { ContextNotFoundError } from '../react/ContextNotFoundError.ts';
import { ScopeContext } from './ScopeContext.ts';
import { isSubscriber, unsubscribe } from '@lib/mediator/Subscriber.ts';
import { isClassInstance } from '@lib/mediator/ICommand.ts';
import { isInitializable, unsubscribeInit } from '@lib/mediator/OnInit.ts';

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
    throw new ContextNotFoundError('Scope is not defined');
  }

  useEffect(() => {
    return () => {
      for (const instance of scope.getInstances()) {
        if (isClassInstance(instance)) {
          if (isSubscriber(instance)) {
            unsubscribe(instance);
          }
          if (isInitializable(instance)) {
            unsubscribeInit(instance);
          }
        }
      }
      scope.dispose();
    };
  }, [scope]);

  return <ScopeContext.Provider value={scope}>{children}</ScopeContext.Provider>;
}

export default Scope;
