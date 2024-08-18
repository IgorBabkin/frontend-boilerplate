import { NotificationMessage } from '@operations/notifications/INotificationController.ts';
import { Subscribable } from 'rxjs';
import { accessor } from '@lib/di/utils.ts';

export interface IModalDialogController {
  notifications$: Subscribable<NotificationMessage>;
}

export const IModalControllerKey = accessor<IModalDialogController>('IModalDialogController');
