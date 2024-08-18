import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { Observable, Subject } from 'rxjs';
import { INotificationService, INotificationServiceKey } from './INotificationService.public';
import { NotificationMessage } from '@operations/notifications/INotificationController.ts';

@register(INotificationServiceKey.register, scope(Scope.application))
@provider(singleton())
export class NotificationService implements INotificationService {
  message$ = new Subject<NotificationMessage>();

  showMessage(message: NotificationMessage) {
    this.message$.next(message);
  }

  getMessage$(): Observable<NotificationMessage> {
    return this.message$.asObservable();
  }
}
