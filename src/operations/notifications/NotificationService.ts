import { map, mergeMap, Observable, Subscribable, timer } from 'rxjs';
import { type INotificationStore, INotificationStoreKey } from '@services/notifications/INotificationService.public.ts';
import { depKey, IContainer, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { IErrorService, IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { Entity } from '@lib/types.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { unsubscribeAll } from '@lib/observable/utils.ts';
import { Unsubscribe } from '@framework/hooks/OnInit.ts';

export type NotificationType = 'info' | 'error' | 'warning' | 'success';

export interface NotificationMessage {
  type: NotificationType;
  title: string;
  body: string;
}

export const INotificationServiceKey = depKey<{
  notifications$: Subscribable<Entity<NotificationMessage>[]>;

  deleteMessage(id: string): void;

  showMessage(message: NotificationMessage): void;
}>('INotificationService')
  .pipe(controller(), singleton())
  .when(Scope.application);

const errorToNotification$ = (s: IErrorService) =>
  s.error$.pipe(
    map((e): NotificationMessage => {
      return { type: 'error', body: e.message, title: 'Error' };
    }),
  );

const timeout$ =
  (delay: number) =>
  (s: INotificationStore): Observable<string> =>
    s.lastMessage$.pipe(mergeMap((m) => timer(delay).pipe(map(() => m.id))));

export const useNotificationService = INotificationServiceKey.register((s: IContainer) => {
  const notificationService = INotificationServiceKey.resolve(s);
  const notifications$ = notificationService.notifications$;

  const showMessage = (message: NotificationMessage) => {
    notificationService.showMessage(message);
  };

  const deleteMessage = (id: string) => {
    notificationService.deleteMessage(id);
  };

  const initialize = (): Unsubscribe => {
    return unsubscribeAll(
      timeout$(5000)(INotificationStoreKey.resolve(s)).subscribe({ next: deleteMessage }),
      errorToNotification$(IErrorServiceKey.resolve(s)).subscribe({ next: showMessage }),
    );
  };

  return {
    notifications$,
    showMessage,
    deleteMessage,
    initialize,
  };
});
