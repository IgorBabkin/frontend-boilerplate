import { useController } from '../../../lib/scope/useQuery.ts';
import { ErrorController, IErrorControllerKey } from './ErrorController.ts';
import { useObservable } from '../../../lib/observable/observable.ts';
import { useMemo } from 'react';

function ErrorsWidget() {
  const errorController = useController<ErrorController>(IErrorControllerKey);
  const error = useObservable(
    useMemo(() => errorController.getError$(), [errorController]),
    undefined,
  );
  return <div>{error?.message}</div>;
}

export default ErrorsWidget;
