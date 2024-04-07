import { useService } from '../../../lib/scope/useQuery.ts';
import { ErrorService, IErrorServiceKey } from './ErrorService.ts';
import { useObservable } from '../../../lib/observable/observable.ts';
import { useMemo } from 'react';

function ErrorsWidget() {
  const errorService = useService<ErrorService>(IErrorServiceKey);
  const error = useObservable(
    useMemo(() => errorService.getError$(), [errorService]),
    undefined,
  );
  return <div>{error?.message}</div>;
}

export default ErrorsWidget;
