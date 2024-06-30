import { accessor } from '@lib/di/utils.ts';
import { Observable } from 'rxjs';

export interface INotificationController {
  getMessage$(): Observable<string | undefined>;
}

export const INotificationControllerKey = accessor<INotificationController>('INotificationController');
