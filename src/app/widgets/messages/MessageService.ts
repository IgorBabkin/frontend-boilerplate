import { accessor } from '@lib/container/utils.ts';
import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { action } from '@lib/mediator/ICommand.ts';
import { DomainError } from '../../domain/errors/DomainError.ts';
import { IMessageStoreKey, MessageStore } from './MessageStore.ts';
import { service } from '@lib/mediator/ServiceProvider.ts';
import { Scope } from '@lib/scope/container.ts';
import { subscribe } from '@lib/scope/Subscriber.ts';
import { error$ } from '../errors/ErrorService.ts';
import { Observable } from 'rxjs';

export const IMessageServiceKey = accessor<IMessageService>(Symbol('IMessageService'));

interface IMessageService {
  getMessage$(): Observable<string | undefined>;
}

@register(IMessageServiceKey.register)
@provider(service, scope(Scope.application), singleton())
export class MessageService implements IMessageService {
  constructor(@inject(IMessageStoreKey.resolve) private messageStore: MessageStore) {}

  @action
  @subscribe(error$)
  addMessage(error: DomainError): void {
    this.messageStore.pushMessage(error.message);
  }

  getMessage$(): Observable<string | undefined> {
    return this.messageStore.getMessage$();
  }
}
