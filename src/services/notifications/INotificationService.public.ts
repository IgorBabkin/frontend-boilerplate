import { Observable } from 'rxjs';
import { accessor } from '../../lib/di/utils';

export interface INotificationService {
  getMessage$(): Observable<string | undefined>;

  showMessage(message: string): void;
}

export const INotificationServiceKey = accessor<INotificationService>('INotificationService');
