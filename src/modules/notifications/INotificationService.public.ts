import { Observable } from 'rxjs';
import { Accessor } from '../../lib/di/utils';

export interface INotificationService {
  getMessage$(): Observable<string | undefined>;

  showMessage(message: string): void;
}

export const INotificationServiceKey = new Accessor<INotificationService>('INotificationService');
