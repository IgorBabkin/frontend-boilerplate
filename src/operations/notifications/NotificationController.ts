import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  INotificationController,
  INotificationControllerKey,
  type NotificationMessage,
} from './INotificationController.ts';
import {
  type INotificationService,
  INotificationServiceKey,
} from '@services/notifications/INotificationService.public.ts';
import { inject, register, scope } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { action } from '@framework/controller/metadata.ts';
import { service } from '@lib/di/utils.ts';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { DomainError } from '@context/errors/DomainError.ts';
import { onStartAsync, subscribeOn } from '@framework/hooks/OnInit.ts';
import { Entity } from '@lib/types.ts';

const errorToMessage = (e: DomainError): NotificationMessage => ({ type: 'error', body: e.message });

@register(INotificationControllerKey.register, scope(Scope.application))
export class NotificationController implements INotificationController {
  message$: Observable<Entity<NotificationMessage>[]> = new BehaviorSubject([]);

  constructor(@inject(INotificationServiceKey.resolve) private notificationService: INotificationService) {
    this.message$ = this.notificationService.getMessage$();
  }

  @action
  @onStartAsync(subscribeOn({ onError: (e) => console.error(e) }))
  showMessage(
    @inject(service(IErrorServiceKey, (s) => s.getError$().pipe(map(errorToMessage)))) message: NotificationMessage,
  ) {
    this.notificationService.showMessage(message);
  }
}
