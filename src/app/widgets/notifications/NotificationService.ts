import { accessor } from '@lib/container/utils.ts';
import { IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { action } from '@lib/mediator/ICommand.ts';
import { DomainError } from '@domain/errors/DomainError.ts';
import { INotificationStoreKey, NotificationStore } from './NotificationStore.ts';
import { Scope } from '@lib/scope/container.ts';
import { error$ } from '../errors/ErrorService.ts';
import { filter, Observable, switchMap, timer } from 'rxjs';
import { isPresent } from '@lib/utils.ts';
import { service } from '@lib/mediator/ServiceMediator.ts';
import { subscribeOn } from '@lib/initialize/strategies.ts';

import { onStart } from '@lib/initialize/OnInit.ts';

export interface INotificationService {
  getMessage$(): Observable<string | undefined>;
  addMessage(message: string): void;
}

export const INotificationServiceKey = accessor<INotificationService>(Symbol('INotificationService'));

const messageLifeTime$ = (c: IContainer) =>
  INotificationStoreKey.resolve(c)
    .getMessage$()
    .pipe(
      filter(isPresent),
      switchMap(() => timer(5000)),
    );

@register(INotificationServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class NotificationService implements INotificationService {
  constructor(@inject(INotificationStoreKey.resolve) private notificationStore: NotificationStore) {}

  @action
  @onStart(subscribeOn())
  handleError(@inject(error$) error: DomainError): void {
    this.notificationStore.pushMessage(error.message);
  }

  addMessage(message: string) {
    this.notificationStore.pushMessage(message);
  }

  getMessage$(): Observable<string | undefined> {
    return this.notificationStore.getMessage$();
  }

  @action
  @onStart(subscribeOn(messageLifeTime$))
  clearMessages() {
    this.notificationStore.clearMessage();
  }
}
