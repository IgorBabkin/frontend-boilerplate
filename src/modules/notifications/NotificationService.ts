import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { DomainError } from '../../context/errors/DomainError';
import { INotificationStoreKey, NotificationStore } from './NotificationStore';
import { Scope } from '@framework/scope.ts';
import { filter, map, Observable, switchMap, timer } from 'rxjs';
import { isPresent } from '../../lib/utils';
import { service } from '@framework/service/ServiceProvider.ts';

import { onStart, subscribeOn } from '@framework/hooks/OnInit';
import { INotificationService, INotificationServiceKey } from './INotificationService.public';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public';
import { operation } from '../../lib/di/utils';
import { action } from '@framework/service/metadata.ts';

const errorToMessage = (e: Error) => e instanceof DomainError && e.message;

@register(INotificationServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class NotificationService implements INotificationService {
  constructor(@inject(INotificationStoreKey.resolve) private notificationStore: NotificationStore) {}

  @action
  @onStart(subscribeOn())
  showMessage(@inject(operation(IErrorServiceKey, (s) => s.getError$().pipe(map(errorToMessage)))) message: string) {
    this.notificationStore.pushMessage(message);
  }

  getMessage$(): Observable<string | undefined> {
    return this.notificationStore.getMessage$();
  }

  @action
  @onStart(
    subscribeOn(
      operation(INotificationServiceKey, (s) =>
        s.getMessage$().pipe(
          filter(isPresent),
          switchMap(() => timer(5000)),
        ),
      ),
    ),
  )
  clearMessages() {
    this.notificationStore.clearMessage();
  }
}
