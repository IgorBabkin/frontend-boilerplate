import { Accessor } from '@lib/di/utils.ts';
import { Observable } from 'rxjs';

export interface INotificationController {
  getMessage$(): Observable<string | undefined>;
}

export const INotificationControllerKey = new Accessor<INotificationController>('INotificationController');
