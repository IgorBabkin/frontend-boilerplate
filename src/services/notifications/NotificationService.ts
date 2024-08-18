import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { Subject } from 'rxjs';
import { INotificationService, INotificationServiceKey } from './INotificationService.public';
import { NotificationMessage } from '@operations/notifications/INotificationController.ts';
import { Service } from '@framework/service/Service.ts';

@register(INotificationServiceKey.register, scope(Scope.application))
@provider(singleton())
export class NotificationService extends Service implements INotificationService {
  message$ = new Subject<NotificationMessage>();

  showMessage(message: NotificationMessage) {
    this.message$.next(message);
  }
}
