import { Subject } from 'rxjs';
import { accessor } from '@core/container/utils';

export const IErrorBusKey = accessor<IErrorBus>(Symbol('IErrorBusKey'));

export type IErrorBus = Subject<Error>;
