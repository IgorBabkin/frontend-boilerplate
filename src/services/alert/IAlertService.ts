import { BehaviorSubject, Observable } from 'rxjs';
import { accessor } from '@lib/di/utils.ts';
import { createEntity, Entity } from '@lib/types.ts';
import { register, scope } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';

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

@register(IAlertServiceKey.register, scope(Scope.application))
export class AlertService implements IAlertService {
  messages$ = new BehaviorSubject<Entity<AlertMessage>[]>([]);

  addAlert(message: AlertMessage): void {
    this.messages$.next([...this.messages$.value, createEntity(message)]);
  }

  deleteAlert(id: string): void {
    this.messages$.next(this.messages$.value.filter((message) => message.id !== id));
  }
}
