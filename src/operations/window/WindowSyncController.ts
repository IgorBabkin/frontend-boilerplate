import { Controller } from '@framework/controller/Controller.ts';
import { service } from '@lib/di/utils.ts';
import { depKey, inject, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { type IAuthStore, IAuthStoreKey } from '@services/auth/IAuthStore.ts';
import { onViewInit } from '@framework/hooks/OnViewInit.ts';
import { ITabsChannelKey, type WindowPostMessage } from '@services/tabs/ITabsChannel.ts';
import { action } from '@framework/controller/metadata.ts';
import { subscribeOn } from '@framework/hooks/initHooks.ts';
import { platform } from '@operations/window/AppConfig.ts';

export interface IWindowSyncController {}

export const IWindowSyncControllerKey = depKey<IWindowSyncController>('IWindowSyncController');

@register(IWindowSyncControllerKey.asKey, platform('web'), controller(), singleton(), scope(Scope.page))
export class WindowSyncController extends Controller implements IWindowSyncController {
  constructor(@inject(IAuthStoreKey) private authService: IAuthStore) {
    super();
  }

  @action
  @onViewInit(subscribeOn())
  async handleMessage(@inject(service(ITabsChannelKey, (s) => s.message$)) message: WindowPostMessage): Promise<void> {
    switch (message.type) {
      case 'logout':
        await this.authService.logout();
        break;
    }
  }
}
