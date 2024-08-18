import { accessor } from '@lib/di/utils.ts';
import { BroadcastChannel } from 'broadcast-channel';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { Subject } from 'rxjs';
import { execute, onDispose, onInit } from '@framework/hooks/OnInit.ts';
import { type IErrorService } from '@framework/errors/IErrorService.public.ts';
import { TabsLogoutError } from '@framework/errors/TabsLogoutError.ts';
import { LogoutReason } from '@context/errors/DomainError.ts';
import { Service } from '@framework/service/Service.ts';

type LogoutMessage = { type: 'logout'; payload: LogoutReason };
export type TabMessage = LogoutMessage;

export interface ITabsChannel {
  dispatch(message: TabMessage): void;
}

export const logoutMessage = (payload: LogoutReason): TabMessage => ({ type: 'logout', payload });

export const isLogoutMessage = (message: TabMessage): message is LogoutMessage => message.type === 'logout';

export const ITabsChannelKey = accessor<ITabsChannel>('ITabsChannel');

@provider(singleton())
@register(ITabsChannelKey.register, scope(Scope.application))
export class TabsChannel extends Service implements ITabsChannel {
  incomeMessage$ = new Subject<TabMessage>();
  private channel = new BroadcastChannel('auth');

  constructor(private errorService: IErrorService) {
    super();
  }

  async dispatch(message: TabMessage): Promise<void> {
    await this.channel.postMessage(message);
  }

  @onInit(execute())
  subscribeToMessages(): void {
    this.channel.onmessage = this.errorService.wrapByErrorHandling(({ data: msg }) => {
      if (isLogoutMessage(msg)) {
        throw new TabsLogoutError(msg.payload);
      }
    });
  }

  @onDispose(execute())
  async dispose(): Promise<void> {
    await this.channel.close();
    this.incomeMessage$.complete();
  }
}
