import { accessor } from '@lib/container/utils.ts';
import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { command } from '@lib/mediator/ICommand.ts';
import { DomainError } from '../../domain/errors/DomainError.ts';
import { MessageStore } from './MessageStore.ts';
import { service } from '@lib/mediator/ServiceProvider.ts';
import { Scope } from '@lib/scope/container.ts';

export const IMessageServiceKey = accessor<IMessageService>(Symbol('IMessageService'));

interface IMessageService {}

@register(IMessageServiceKey.register)
@provider(service, scope(Scope.application), singleton())
export class MessageService implements IMessageService {
  constructor(@inject(IMessageServiceKey.resolve) private messageBus: MessageStore) {}

  @command
  addMessage(error: DomainError): void {
    this.messageBus.addMessage(error.message);
  }
}
