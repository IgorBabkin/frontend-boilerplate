import { map, mergeMap, Observable, Subscribable, timer } from 'rxjs';
import {
  type INotificationService,
  INotificationServiceKey,
} from '@services/notifications/INotificationService.public.ts';
import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { action } from '@framework/controller/metadata.ts';
import { accessor, service } from '@lib/di/utils.ts';
import { IErrorService, IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { onInit, subscribeOn } from '@framework/hooks/OnInit.ts';
import { Entity } from '@lib/types.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';

export type NotificationType = 'info' | 'error' | 'warning' | 'success';

export interface NotificationMessage {
  type: NotificationType;
  title: string;
  body: string;
}

export interface INotificationController {
  notifications$: Subscribable<Entity<NotificationMessage>[]>;

  deleteMessage(id: string): void;
}

export const INotificationControllerKey = accessor<INotificationController>('INotificationController');

const errorToNotification$ = (s: IErrorService) =>
  s.error$.pipe(
    map((e) => {
      return { type: 'error', body: e.message };
    }),
  );

const timeout$ =
  (delay: number) =>
  (s: INotificationService): Observable<string> =>
    s.lastMessage$.pipe(mergeMap((m) => timer(delay).pipe(map(() => m.id))));

@provider(controller, singleton())
@register(INotificationControllerKey.register, scope(Scope.application))
export class NotificationController implements INotificationController {
  notifications$: Subscribable<Entity<NotificationMessage>[]>;

  constructor(@inject(INotificationServiceKey.resolve) private notificationService: INotificationService) {
    this.notifications$ = this.notificationService.messages$;
  }

  @action
  @onInit(subscribeOn({ onError: (e) => console.error(e) }))
  showMessage(@inject(service(IErrorServiceKey, errorToNotification$)) message: NotificationMessage) {
    this.notificationService.showMessage(message);
  }

  @onInit(subscribeOn())
  deleteMessage(@inject(service(INotificationServiceKey, timeout$(5000))) id: string) {
    this.notificationService.deleteMessage(id);
  }
}
