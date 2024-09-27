import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { accessor, service } from '@lib/di/utils.ts';
import { createEntity, Entity } from '@lib/types.ts';
import { inject, register, scope } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { onInit, subscribeOn } from '@framework/hooks/OnInit.ts';
import { IErrorService, IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { isPresent } from '@lib/utils.ts';

export interface AlertMessage {
  title: string;
  body: string;
  type: 'info' | 'error' | 'warning' | 'success';
  showLoginButton?: boolean;
}

export const IAlertServiceKey = accessor<IAlertService>('IAlertService');

export interface IAlertService {
  messages$: Observable<Entity<AlertMessage>[]>;

  addAlert(message: AlertMessage): void;

  deleteAlert(id: string): void;
}

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

@register(IAlertServiceKey.register, scope(Scope.application))
export class AlertService implements IAlertService {
  messages$ = new BehaviorSubject<Entity<AlertMessage>[]>([]);

  @onInit(subscribeOn())
  addAlert(@inject(service(IErrorServiceKey, errorToAlert$)) message: AlertMessage): void {
    this.messages$.next([...this.messages$.value, createEntity(message)]);
  }

  deleteAlert(id: string): void {
    this.messages$.next(this.messages$.value.filter((message) => message.id !== id));
  }
}
