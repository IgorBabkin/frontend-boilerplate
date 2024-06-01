import { accessor } from '@core/container/utils';
import { IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { action } from '@framework/components/operations';
import { DomainError } from '../errors/DomainError';
import { INotificationStoreKey, NotificationStore } from './NotificationStore';
import { Scope } from '@framework/scope/container';
import { error$ } from '@modules/errors/ErrorService';
import { filter, map, Observable, switchMap, timer } from 'rxjs';
import { isPresent } from '@core/utils';
import { service } from '@framework/components/ServiceProvider';

import { onStart, subscribeOn } from '@framework/initialize/OnInit';

export interface INotificationService {
  getMessage$(): Observable<string | undefined>;
  showMessage(message: string): void;
}

export const INotificationServiceKey = accessor<INotificationService>(Symbol('INotificationService'));

const hideMessage$ = (c: IContainer) =>
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
  @onStart(subscribeOn(hideMessage$))
  clearMessages() {
    this.notificationStore.clearMessage();
  }
}
