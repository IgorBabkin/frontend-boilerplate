import { accessor } from '@lib/di/utils.ts';
import { BroadcastChannel } from 'broadcast-channel';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { Observable, Subject } from 'rxjs';
import { execute, onDispose, onInit } from '@framework/hooks/OnInit.ts';
import { Service } from '@framework/service/Service.ts';

type LogoutMessage = { type: 'logout' };
export type WindowPostMessage = LogoutMessage;

export interface ITabsChannel {
  message$: Observable<WindowPostMessage>;
  dispatch(message: WindowPostMessage): void;
}

export const logoutMessage = (): WindowPostMessage => ({ type: 'logout' });

export const ITabsChannelKey = accessor<ITabsChannel>('ITabsChannel');

@provider(singleton())
@register(ITabsChannelKey.register, scope(Scope.application))
export class TabsChannel extends Service implements ITabsChannel {
  message$ = new Subject<WindowPostMessage>();
  private channel = new BroadcastChannel('auth');

  async dispatch(message: WindowPostMessage): Promise<void> {
    await this.channel.postMessage(message);
  }

  @onInit(execute())
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
