import { Subscription } from 'rxjs';
import { CommandMethod, CommandMethodKeys, Payload } from '@lib/mediator/types.ts';

export class FailedCommand<Target extends object> {
  constructor(
    public target: Target,
    public method: keyof Target,
    public payload: Payload<Target, keyof Target>,
    public error: unknown,
  ) {}

  async retry(mediator: IMediator<Target>): Promise<void> {
    // eslint-disable-next-line
    await mediator.send(this.target, this.method as any, this.payload);
  }
}

export interface IMediator<Command extends object> {
  send<TService extends Command, Key extends CommandMethodKeys<TService, CommandMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Promise<void | Subscription>;
}
