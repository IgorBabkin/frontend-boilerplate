import { Subject } from 'rxjs';
import { accessor } from '@lib/container/utils.ts';

export const IErrorBusKey = accessor<IErrorBus>(Symbol('IErrorBusKey'));

export type IErrorBus = Subject<Error>;
