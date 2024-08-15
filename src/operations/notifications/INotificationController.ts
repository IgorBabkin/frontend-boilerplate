import { accessor } from '@lib/di/utils.ts';
import { Observable } from 'rxjs';

export type NotificationType = 'info' | 'error' | 'warning' | 'success';

export interface NotificationMessage {
  type: NotificationType;
  title: string;
  body: string;
}

export interface INotificationController {
  message$: Observable<NotificationMessage>;
}

export const INotificationControllerKey = accessor<INotificationController>('INotificationController');
