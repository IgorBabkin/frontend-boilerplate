import React, { MouseEvent, useCallback } from 'react';
import { useDep } from '@helpers/scope/ScopeContext.ts';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';

// Define base props that include onClick
type BaseProps = {
  onClick?: (event: MouseEvent) => void;
};

// HOC function
export function withTryCatchOnClick<T extends BaseProps>(
  WrappedComponent: React.ComponentType<T>,
): React.ComponentType<T> {
  return function TryCatchWrapper(props: T) {
    const { onClick, ...rest } = props;
    const errorService = useDep(IErrorServiceKey);

    const handleClick = useCallback(
      (event: MouseEvent) => {
        try {
          onClick?.(event);
        } catch (error) {
          errorService.handleError(error);
        }
      },
      [errorService, onClick],
    );

    return <WrappedComponent {...(rest as T)} onClick={handleClick} />;
  };
}
