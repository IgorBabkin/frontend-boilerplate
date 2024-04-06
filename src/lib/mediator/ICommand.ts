import { Observable } from 'rxjs';
import { constructor, getHooks, getMetadata, hook, setMetadata } from 'ts-ioc-container';

export const onCommandInit = hook('onCommandInit');
export const getCommandInitHooks = (command: ICommand) => getHooks(command, 'onCommandInit') ?? [];

export interface ICommand<TPayload = unknown> {
  execute(payload: TPayload): Promise<void>;
  match?(payload: unknown): payload is TPayload;
}

export function matchPayload<TPayload>(command: ICommand<TPayload>, payload: unknown): payload is TPayload {
  return command.match ? command.match(payload) : true;
}

export interface IObservableQuery<TPayload = unknown, TResponse = unknown> {
  create(payload: TPayload): Observable<TResponse>;
}

export const beforeExecution = (...commands: constructor<ICommand>[]) => setMetadata('beforeExecution', commands);

export const getBeforeExecution = (condition: ICommand | IObservableQuery) =>
  getMetadata<constructor<ICommand>[]>(condition.constructor, 'beforeExecution') ?? [];
