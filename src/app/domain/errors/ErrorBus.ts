import { Subject } from 'rxjs';

export const IErrorBusKey = Symbol('IErrorBusKey');

export type IErrorBus = Subject<Error>;

export const createErrorBus = (): IErrorBus => new Subject();
