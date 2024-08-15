import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { Observable, Subject } from 'rxjs';
import { INotificationService, INotificationServiceKey } from './INotificationService.public';
import { service } from '@framework/service/ServiceProvider.ts';
import { NotificationMessage } from '@operations/notifications/INotificationController.ts';

@register(INotificationServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class NotificationService implements INotificationService {
  private messages$ = new Subject<NotificationMessage>();

  showMessage(message: NotificationMessage) {
    this.messages$.next(message);
  }

  getMessage$(): Observable<NotificationMessage> {
    return this.messages$.asObservable();
  }
}
