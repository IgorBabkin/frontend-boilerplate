import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import Scope, { IScopeProps } from '@helpers/scope/Scope';
import { IContainer } from 'ts-ioc-container';
import { useParams, useSearchParams } from 'react-router-dom';
import { IPageServiceKey } from '@context/IPageService.ts';
import { useDependency } from '@helpers/scope/ScopeContext.ts';

const createScope = (parent: IContainer, tags: string[]) => parent.createScope(...tags);

const withScope = <Props,>(Component: FC<Props>, scopeProps: IScopeProps) => {
  return (props: PropsWithChildren<Props>) => (
    <Scope {...scopeProps}>
      <Component {...props} />
    </Scope>
  );
};

export const widget = <Props,>(Component: FC<Props>, ...tags: string[]) =>
  withScope(Component, {
    tags: ['widget', ...tags].join(','),
    createScope,
  });

const usePageContext = () => {
  const [searchParams] = useSearchParams();
  const urlParams = useParams();
  return useMemo(() => ({ searchParams, urlParams }), [searchParams, urlParams]);
};

export const page = <Props,>(Component: FC<Props>, ...tags: string[]) => {
  const tagStr = ['page', ...tags].join(',');
  return (props: PropsWithChildren<Props>) => {
    const context = usePageContext();
    const pageService = useDependency(IPageServiceKey.resolve);
    useEffect(() => pageService.setContext(context));
    return (
      <Scope tags={tagStr} createScope={createScope}>
        <Component {...props} />
      </Scope>
    );
  };
};

export const application = <Props,>(Component: FC<Props>, fallback: (tags: string[]) => IContainer) =>
  withScope(Component, { tags: 'application', fallback, createScope });
