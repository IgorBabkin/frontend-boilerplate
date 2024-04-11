import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { accessor } from '@lib/container/utils.ts';
import { Scope } from '@lib/scope/container.ts';

export const INotificationStoreKey = accessor<NotificationStore>(Symbol('INotificationStore'));

@register(INotificationStoreKey.register)
@provider(scope(Scope.application), singleton())
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
