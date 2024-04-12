import { FC, PropsWithChildren } from 'react';
import Scope, { IScopeProps } from '@lib/scope/Scope.tsx';
import { IContainer } from 'ts-ioc-container';

export const withScope = <Props,>(Component: FC<Props>, scopeProps: IScopeProps = {}) => {
  return (props: PropsWithChildren<Props>) => (
    <Scope {...scopeProps}>
      <Component {...props} />
    </Scope>
  );
};

export const ScopeProps = {
  widget: (...tags: string[]) => ({ tags: ['widget', ...tags].join(',') }),
  application: (fallback: (tags: string[]) => IContainer) => ({ tags: 'application', fallback }),
  page: (...tags: string[]) => ({ tags: ['page', ...tags].join(',') }),
};
