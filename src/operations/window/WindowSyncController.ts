import { Controller } from '@framework/controller/Controller.ts';
import { service } from '@lib/di/utils.ts';
import { by, depKey, type IContainer, inject, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { type IAuthStore, IAuthStoreKey } from '@services/auth/IAuthStore.ts';
import { onInit } from '@framework/hooks/OnInit.ts';
import { ITabsChannelKey, type WindowPostMessage } from '@services/tabs/ITabsChannel.ts';
import { action } from '@framework/controller/metadata.ts';
import { subscribeOn } from '@framework/hooks/initHooks.ts';

export interface IWindowSyncController {}

export const IWindowSyncControllerKey = depKey<IWindowSyncController>('IWindowSyncController');

@register(IWindowSyncControllerKey, scope(Scope.application), controller(), singleton(), 'required')
export class WindowSyncController extends Controller implements IWindowSyncController {
  constructor(
    @inject(by.scope.current) scope: IContainer,
    @inject(IAuthStoreKey.resolve) private authService: IAuthStore,
  ) {
    super(scope);
  }

  @action
  @onInit(subscribeOn())
  async handleMessage(@inject(service(ITabsChannelKey, (s) => s.message$)) message: WindowPostMessage): Promise<void> {
    switch (message.type) {
      case 'logout':
        await this.authService.logout();
        break;
    }
  }
}
