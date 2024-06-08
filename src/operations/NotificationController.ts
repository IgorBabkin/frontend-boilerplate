import { map, Observable } from 'rxjs';
import { INotificationController, INotificationControllerKey } from './INotificationController.ts';
import {
  type INotificationService,
  INotificationServiceKey,
} from '../services/notifications/INotificationService.public.ts';
import { inject, register, scope } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { action, query } from '@framework/controller/metadata.ts';
import { service } from '@lib/di/utils.ts';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { DomainError } from '@context/errors/DomainError.ts';
import { onStartAsync, subscribeOn } from '@framework/hooks/OnInit.ts';

const errorToMessage = (e: Error) => e instanceof DomainError && e.message;

@register(INotificationControllerKey.register, scope(Scope.application))
export class NotificationController implements INotificationController {
  constructor(@inject(INotificationServiceKey.resolve) private notificationService: INotificationService) {}

  @query getMessage$(): Observable<string | undefined> {
    return this.notificationService.getMessage$();
  }

  @action
  @onStartAsync(subscribeOn())
  showMessage(@inject(service(IErrorServiceKey, (s) => s.getError$().pipe(map(errorToMessage)))) message: string) {
    this.notificationService.showMessage(message);
  }
}
