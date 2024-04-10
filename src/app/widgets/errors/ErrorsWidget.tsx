import { IErrorServiceKey } from './ErrorService.ts';
import { useObservable } from '@lib/observable/observable.ts';
import { useDependency } from '@lib/scope/ScopeContext.ts';

function ErrorsWidget() {
  const errorService = useDependency(IErrorServiceKey.resolve);
  const error = useObservable(() => errorService.getError$(), undefined, [errorService]);
  return <div>{error?.message}</div>;
}

export default ErrorsWidget;
