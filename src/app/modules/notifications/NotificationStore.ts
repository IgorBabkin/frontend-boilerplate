import { ObservableStore } from '@core/observable/ObservableStore';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { accessor } from '@core/container/utils';
import { Scope } from '@framework/scope/container';

export const INotificationStoreKey = accessor<NotificationStore>(Symbol('INotificationStore'));

@register(INotificationStoreKey.register, scope(Scope.application))
@provider(singleton())
export class NotificationStore {
  private messages = new ObservableStore<string | undefined>(undefined);

  pushMessage(message: string) {
    this.messages.map(() => message);
  }

  getMessage$() {
    return this.messages.asObservable();
  }

  clearMessage() {
    this.messages.map(() => undefined);
  }
}
