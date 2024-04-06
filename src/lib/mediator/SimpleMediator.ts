import { Observable, Subject } from 'rxjs';
import { IMediator } from './IMediator.ts';
import { getBeforeExecution, ICommand, IObservableQuery, matchPayload } from './ICommand.ts';
import { type IContainer } from 'ts-ioc-container';

export class SimpleMediator implements IMediator {
  constructor(private scope: IContainer) {}

  send$<TPayload, TResponse>(query: IObservableQuery<TPayload, TResponse>, payload: TPayload): Observable<TResponse> {
    const result$ = new Subject<TResponse>();
    this.runBeforeCommands(query)
      .then(() => {
        query.create(payload).subscribe(result$);
      })
      .catch((e: unknown) => {
        result$.error(e);
      });
    return result$.asObservable();
  }

  async send<TPayload>(command: ICommand<TPayload>, payload: TPayload): Promise<void> {
    await this.runBeforeCommands(command);
    await command.execute(payload);
  }

  private async runBeforeCommands(target: IObservableQuery | ICommand) {
    const beforeCommands = getBeforeExecution(target)
      .map((c) => this.scope.resolve(c))
      .filter((c) => matchPayload(c, target));

    for (const c of beforeCommands) {
      await c.execute(target);
    }
  }
}
