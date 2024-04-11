import { accessor } from '@lib/container/utils.ts';
import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { action } from '@lib/mediator/ICommand.ts';
import { DomainError } from '../../domain/errors/DomainError.ts';
import { INotificationStoreKey, NotificationStore } from './NotificationStore.ts';
import { service } from '@lib/mediator/ServiceProvider.ts';
import { Scope } from '@lib/scope/container.ts';
import { subscribe } from '@lib/scope/Subscriber.ts';
import { error$ } from '../errors/ErrorService.ts';
import { Observable } from 'rxjs';

export const INotificationServiceKey = accessor<INotificationService>(Symbol('INotificationService'));

interface INotificationService {
  getMessage$(): Observable<string | undefined>;
}

@register(INotificationServiceKey.register)
@provider(service, scope(Scope.application), singleton())
export class NotificationService implements INotificationService {
  constructor(@inject(INotificationStoreKey.resolve) private notificationStore: NotificationStore) {}

  @action
  @subscribe(error$)
  addMessage(error: DomainError): void {
    this.notificationStore.pushMessage(error.message);
  }

  getMessage$(): Observable<string | undefined> {
    return this.notificationStore.getMessage$();
  }
}
