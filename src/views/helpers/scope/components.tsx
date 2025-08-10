import { FC, PropsWithChildren } from 'react';
import Scope, { IScopeProps } from '@helpers/scope/Scope';
import { IContainer } from 'ts-ioc-container';
import { onViewInit } from '@framework/hooks/OnViewInit.ts';

const createScope = (parent: IContainer, tags: string[]) => parent.createScope({ tags });

const withScope = <Props,>(Component: FC<Props>, scopeProps: IScopeProps) => {
  return (props: PropsWithChildren<Props>) => (
    <Scope {...scopeProps}>
      <Component {...props} />
    </Scope>
  );
};

export const widget = <Props,>(Component: FC<Props>, ...tags: string[]) => {
  const scopeProps = { tags: ['widget', ...tags].join(',') };
  return (props: PropsWithChildren<Props>) => (
    <Scope {...scopeProps}>
      <Component {...props} />
    </Scope>
  );
};

class PageContextService {
  private params: Record<string, string> = {};
  private searchParams: Record<string, string> = {};

  @onViewInit()
  setParams(params: Record<string, string>) {
    this.params = params;
  }

  getParams() {
    return this.params;
  }

  setSearchParams(searchParams: Record<string, string>) {
    this.searchParams = searchParams;
  }

  getSearchParams() {
    return this.searchParams;
  }
}

export const page = <Props,>(Component: FC<Props>, ...tags: string[]) => {
  const tagStr = ['page', ...tags].join(',');
  return (props: PropsWithChildren<Props>) => {
    return (
      <Scope tags={tagStr} createScope={createScope}>
        <Component {...props} />
      </Scope>
    );
  };
};

export const application = <Props,>(Component: FC<Props>, fallback: (tags: string[]) => IContainer) =>
  withScope(Component, { tags: 'application', fallback, createScope });
