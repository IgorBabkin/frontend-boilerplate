import { Observable } from 'rxjs';
import { Entity } from '@lib/types.ts';
import { NotificationMessage } from '@operations/notifications/NotificationService.ts';
import { depKey } from 'ts-ioc-container';

export interface INotificationStore {
  messages$: Observable<Entity<NotificationMessage>[]>;

  lastMessage$: Observable<Entity<NotificationMessage>>;

  showMessage(message: NotificationMessage): void;

  deleteMessage(id: string): void;
}

export const INotificationStoreKey = depKey<INotificationStore>('INotificationStore');
