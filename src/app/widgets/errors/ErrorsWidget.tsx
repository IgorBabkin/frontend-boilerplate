import { ErrorService, IErrorServiceKey } from './ErrorService.ts';
import { useObservable } from '../../../lib/observable/observable.ts';
import { useMemo } from 'react';
import { useDependency } from '../../../lib/scope/ScopeContext.ts';

function ErrorsWidget() {
  const errorService = useDependency<ErrorService>(IErrorServiceKey);
  const error = useObservable(
    useMemo(() => errorService.getError$(), [errorService]),
    undefined,
  );
  return <div>{error?.message}</div>;
}

export default ErrorsWidget;
