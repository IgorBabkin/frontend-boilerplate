import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { INotificationService, INotificationServiceKey } from './INotificationService.public';
import { Service } from '@framework/service/Service.ts';
import { createEntity, Entity } from '@lib/types.ts';
import { BehaviorSubject, filter, map } from 'rxjs';
import { NotificationMessage } from '@operations/notifications/NotificationController.ts';
import { lastElementOfArray } from '@lib/utils.ts';

@provider(singleton())
@register(INotificationServiceKey.register, scope(Scope.application))
export class NotificationService extends Service implements INotificationService {
  messages$ = new BehaviorSubject<Entity<NotificationMessage>[]>([]);
  lastMessage$ = this.messages$.pipe(
    filter((m) => m.length > 0),
    map((m) => lastElementOfArray(m)),
  );

  showMessage(message: NotificationMessage) {
    this.messages$.next([...this.messages$.getValue(), createEntity(message)]);
  }

  deleteMessage(id: string) {
    this.messages$.next(this.messages$.getValue().filter((n) => n.id !== id));
  }
}
