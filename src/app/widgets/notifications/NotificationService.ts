import { accessor } from '@lib/container/utils.ts';
import { inject, register, scope, singleton } from 'ts-ioc-container';
import { action } from '@lib/mediator/ICommand.ts';
import { DomainError } from '@domain/errors/DomainError.ts';
import { INotificationStoreKey, NotificationStore } from './NotificationStore.ts';
import { service } from '@lib/mediator/ServiceProvider.ts';
import { Scope } from '@lib/scope/container.ts';
import { subscribeOn } from '@lib/mediator/Subscriber.ts';
import { error$ } from '../errors/ErrorService.ts';
import { filter, Observable, switchMap, timer } from 'rxjs';
import { onInit } from '@lib/mediator/OnInit.ts';
import { isPresent } from '@lib/utils.ts';

export interface INotificationService {
  getMessage$(): Observable<string | undefined>;
}

export const INotificationServiceKey = accessor<INotificationService>(Symbol('INotificationService'));

@register(INotificationServiceKey.register, scope(Scope.application), service, singleton())
export class NotificationService implements INotificationService {
  constructor(@inject(INotificationStoreKey.resolve) private notificationStore: NotificationStore) {}

  @action
  @subscribeOn(error$)
  addMessage(error: DomainError): void {
    this.notificationStore.pushMessage(error.message);
  }

  getMessage$(): Observable<string | undefined> {
    return this.notificationStore.getMessage$();
  }

  @onInit
  @action
  setMessageLifeTime() {
    return this.notificationStore
      .getMessage$()
      .pipe(
        filter(isPresent),
        switchMap(() => timer(5000)),
      )
      .subscribe(() => this.notificationStore.clearMessage());
  }
}
