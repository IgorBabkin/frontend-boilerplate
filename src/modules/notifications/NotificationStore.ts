import { ObservableStore } from '../../lib/observable/ObservableStore';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { Accessor } from '../../lib/di/utils';

export const INotificationStoreKey = new Accessor<NotificationStore>('INotificationStore');

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
