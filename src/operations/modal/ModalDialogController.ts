import { Subscribable } from 'rxjs';
import { type NotificationMessage } from '../notifications/INotificationController.ts';
import {
  type INotificationService,
  INotificationServiceKey,
} from '@services/notifications/INotificationService.public.ts';
import { inject, register, scope } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { IModalControllerKey, IModalDialogController } from '@operations/modal/IModalDialogController.ts';

@register(IModalControllerKey.register, scope(Scope.application))
export class ModalDialogController implements IModalDialogController {
  notifications$: Subscribable<NotificationMessage>;

  constructor(@inject(INotificationServiceKey.resolve) notificationService: INotificationService) {
    this.notifications$ = notificationService.message$;
  }
}
