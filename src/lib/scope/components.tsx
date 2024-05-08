import { FC, PropsWithChildren } from 'react';
import Scope, { IScopeProps } from '@lib/scope/Scope.tsx';
import { IContainer } from 'ts-ioc-container';

const withScope = <Props,>(Component: FC<Props>, scopeProps: IScopeProps = {}) => {
  return (props: PropsWithChildren<Props>) => (
    <Scope {...scopeProps}>
      <Component {...props} />
    </Scope>
  );
};

export const widget = <Props,>(Component: FC<Props>, ...tags: string[]) =>
  withScope(Component, { tags: ['widget', ...tags].join(',') });

export const page = <Props,>(Component: FC<Props>, ...tags: string[]) =>
  withScope(Component, { tags: ['page', ...tags].join(',') });

export const application = <Props,>(Component: FC<Props>, fallback: (tags: string[]) => IContainer) =>
  withScope(Component, { tags: 'application', fallback });
