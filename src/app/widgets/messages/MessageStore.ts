import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { accessor } from '@lib/container/utils.ts';
import { Scope } from '@lib/scope/container.ts';

export const IMessageStoreKey = accessor<MessageStore>(Symbol('IMessageStore'));

@register(IMessageStoreKey.register)
@provider(scope(Scope.application), singleton())
export class MessageStore {
  private messages = new ObservableStore<string[]>([]);

  addMessage(message: string) {
    this.messages.map((messages) => [...messages, message]);
  }
}
