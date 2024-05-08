import { accessor } from '@lib/container/utils.ts';
import { IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { action } from '@lib/mediator/ICommand.ts';
import { DomainError } from '@domain/errors/DomainError.ts';
import { INotificationStoreKey, NotificationStore } from './NotificationStore.ts';
import { Scope } from '@lib/scope/container.ts';
import { error$ } from '../errors/ErrorService.ts';
import { filter, map, Observable, switchMap, timer } from 'rxjs';
import { isPresent } from '@lib/utils.ts';
import { service } from '@lib/mediator/ServiceMediator.ts';

import { onStart, subscribeOn } from '@lib/initialize/OnInit.ts';

export interface INotificationService {
  getMessage$(): Observable<string | undefined>;
  showMessage(message: string): void;
}

export const INotificationServiceKey = accessor<INotificationService>(Symbol('INotificationService'));

const messageLifeTime$ = (c: IContainer) =>
  INotificationStoreKey.resolve(c)
    .getMessage$()
    .pipe(
      filter(isPresent),
      switchMap(() => timer(5000)),
    );

const errorToMessage = (getError$: (c: IContainer) => Observable<Error>) => (c: IContainer) =>
  getError$(c).pipe(map((e) => e instanceof DomainError && e.message));

@register(INotificationServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class NotificationService implements INotificationService {
  constructor(@inject(INotificationStoreKey.resolve) private notificationStore: NotificationStore) {}

  @action
  @onStart(subscribeOn())
  showMessage(@inject(errorToMessage(error$)) message: string) {
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
