import { useQuery } from '../../../lib/scope/useQuery.ts';
import { GetErrors } from './GetErrors.ts';

function ErrorsWidget() {
  const error = useQuery(GetErrors, undefined, undefined);
  return <div>{error?.message}</div>;
}

export default ErrorsWidget;
