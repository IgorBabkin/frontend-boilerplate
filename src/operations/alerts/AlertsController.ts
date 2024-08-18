import { filter, map, Observable } from 'rxjs';
import { INotificationServiceKey } from '@services/notifications/INotificationService.public.ts';
import { inject, register, scope } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { type AlertMessage, type IAlertService } from '@services/alert/IAlertService.ts';
import { Entity } from '@lib/types.ts';
import { accessor, service } from '@lib/di/utils.ts';
import { onInit, subscribeOn } from '@framework/hooks/OnInit.ts';
import { IErrorService, IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { isPresent } from '@lib/utils.ts';

export interface IModalDialogController {
  alerts$: Observable<Entity<AlertMessage>[]>;

  closeAlert(id: string): void;
}

export const IModalControllerKey = accessor<IModalDialogController>('IModalDialogController');

const errorToAlert$ = (s: IErrorService): Observable<AlertMessage> =>
  s.error$.pipe(
    map((e): AlertMessage | undefined => {
      if (e.message) {
        return { type: 'error', body: e.message, title: 'asdads' };
      }
      return undefined;
    }),
    filter(isPresent),
  );

@register(IModalControllerKey.register, scope(Scope.application))
export class AlertsController implements IModalDialogController {
  alerts$: Observable<Entity<AlertMessage>[]>;

  constructor(@inject(INotificationServiceKey.resolve) private alertService: IAlertService) {
    this.alerts$ = this.alertService.messages$;
  }

  @onInit(subscribeOn())
  showAlert(@inject(service(IErrorServiceKey, errorToAlert$)) message: AlertMessage) {
    this.alertService.addAlert(message);
  }

  closeAlert(id: string) {
    this.alertService.deleteAlert(id);
  }
}
