import { register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { INotificationStore, INotificationStoreKey } from './INotificationService.public';
import { Store } from '@framework/service/Store.ts';
import { createEntity, Entity } from '@lib/types.ts';
import { BehaviorSubject, filter, map } from 'rxjs';
import { NotificationMessage } from '@operations/notifications/NotificationService.ts';
import { lastElementOfArray } from '@lib/utils.ts';

@register(INotificationStoreKey, scope(Scope.application), singleton())
export class NotificationStore extends Store implements INotificationStore {
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
