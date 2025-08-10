import { BroadcastChannel } from 'broadcast-channel';
import { depKey, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { Observable, Subject } from 'rxjs';
import { onDispose, onViewInit } from '@framework/hooks/OnViewInit.ts';
import { Store } from '@framework/service/Store.ts';
import { execute } from '@framework/hooks/initHooks.ts';

type LogoutMessage = { type: 'logout' };
export type WindowPostMessage = LogoutMessage;

export interface ITabsChannel {
  message$: Observable<WindowPostMessage>;
  dispatch(message: WindowPostMessage): void;
}

export const logoutMessage = (): WindowPostMessage => ({ type: 'logout' });

export const ITabsChannelKey = depKey<ITabsChannel>('ITabsChannel');

@register(ITabsChannelKey, scope(Scope.application), singleton())
export class TabsChannel extends Store implements ITabsChannel {
  message$ = new Subject<WindowPostMessage>();
  private channel = new BroadcastChannel('auth');

  async dispatch(message: WindowPostMessage): Promise<void> {
    await this.channel.postMessage(message);
  }

  @onViewInit(execute())
  subscribeToMessages(): void {
    this.channel.onmessage = ({ data: msg }) => {
      this.message$.next(msg);
    };
  }

  @onDispose(execute())
  async dispose(): Promise<void> {
    await this.channel.close();
    this.message$.complete();
  }
}
