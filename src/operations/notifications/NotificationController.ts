import { BehaviorSubject, map, mergeMap, mergeWith, Observable, timer } from 'rxjs';
import {
  INotificationController,
  INotificationControllerKey,
  type NotificationMessage,
} from './INotificationController.ts';
import {
  type INotificationService,
  INotificationServiceKey,
} from '@services/notifications/INotificationService.public.ts';
import { IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { action } from '@framework/controller/metadata.ts';
import { service } from '@lib/di/utils.ts';
import { IErrorService, IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { onInit, sourceEvents, subscribeOn } from '@framework/hooks/OnInit.ts';
import { Entity } from '@lib/types.ts';
import { createPatch, EntityPatch } from '@context/EntityPatch.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';

const notificationPatch$ = (s: IContainer): Observable<EntityPatch<Entity<NotificationMessage>>> => {
  const patchAdd$ = INotificationServiceKey.resolve(s).message$.pipe(map(createPatch));
  const timeout$ = patchAdd$.pipe(
    mergeMap((message) =>
      timer(5000).pipe(
        map(
          () => ({ type: 'remove', value: (message.value as Entity).id }) as EntityPatch<Entity<NotificationMessage>>,
        ),
      ),
    ),
  );
  return patchAdd$.pipe(mergeWith(timeout$));
};

const errorToMessage$ = (s: IErrorService) =>
  s.error$.pipe(
    map((e) => {
      return { type: 'error', body: e.message };
    }),
  );

@provider(controller, singleton())
@register(INotificationControllerKey.register, scope(Scope.application))
export class NotificationController implements INotificationController {
  @onInit(sourceEvents({ src: notificationPatch$ }))
  notifications$ = new BehaviorSubject<Entity<NotificationMessage>[]>([]);

  constructor(@inject(INotificationServiceKey.resolve) private notificationService: INotificationService) {}

  @action
  @onInit(subscribeOn({ onError: (e) => console.error(e) }))
  showMessage(@inject(service(IErrorServiceKey, errorToMessage$)) message: NotificationMessage) {
    this.notificationService.showMessage(message);
  }

  deleteMessage(id: string) {
    this.notifications$.next(this.notifications$.value.filter((n) => n.id !== id));
  }
}
