import { accessor } from '@lib/di/utils.ts';
import { Entity } from '@lib/types.ts';
import { Subscribable } from 'rxjs';

export type NotificationType = 'info' | 'error' | 'warning' | 'success';

export interface NotificationMessage {
  type: NotificationType;
  title: string;
  body: string;
}

export interface INotificationController {
  notifications$: Subscribable<Entity<NotificationMessage>[]>;

  deleteMessage(id: string): void;
}

export const INotificationControllerKey = accessor<INotificationController>('INotificationController');
