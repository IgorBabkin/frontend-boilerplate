import { Observable } from 'rxjs';
import { accessor } from '@lib/di/utils.ts';
import { Entity } from '@lib/types.ts';
import { NotificationMessage } from '@operations/notifications/NotificationService.ts';

export interface INotificationStore {
  messages$: Observable<Entity<NotificationMessage>[]>;

  lastMessage$: Observable<Entity<NotificationMessage>>;

  showMessage(message: NotificationMessage): void;

  deleteMessage(id: string): void;
}

export const INotificationStoreKey = accessor<INotificationStore>('INotificationStore');
