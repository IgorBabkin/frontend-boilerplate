import { Observable } from 'rxjs';
import { accessor } from '@lib/di/utils.ts';
import { NotificationMessage } from '@operations/notifications/INotificationController.ts';

export interface INotificationService {
  getMessage$(): Observable<NotificationMessage>;

  showMessage(message: NotificationMessage): void;
}

export const INotificationServiceKey = accessor<INotificationService>('INotificationService');
