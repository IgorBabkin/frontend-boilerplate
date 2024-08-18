import { Controller } from '@framework/controller/Controller.ts';
import { accessor, service } from '@lib/di/utils.ts';
import { alias, by, type IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { type IAuthService, IAuthServiceKey } from '@services/auth/IAuthService.public.ts';
import { onInit, subscribeOn } from '@framework/hooks/OnInit.ts';
import { ITabsChannelKey, type WindowPostMessage } from '@services/tabs/ITabsChannel.ts';
import { action } from '@framework/controller/metadata.ts';

export interface IWindowSyncController {}

export const IWindowSyncControllerKey = accessor<IWindowSyncController>('IWindowSyncController');

@provider(controller, singleton(), alias('required'))
@register(IWindowSyncControllerKey.register, scope(Scope.application))
export class WindowSyncController extends Controller implements IWindowSyncController {
  constructor(
    @inject(by.scope.current) scope: IContainer,
    @inject(IAuthServiceKey.resolve) private authService: IAuthService,
  ) {
    super(scope);
  }

  @onInit(subscribeOn())
  @action
  async handleMessage(@inject(service(ITabsChannelKey, (s) => s.message$)) message: WindowPostMessage): Promise<void> {
    switch (message.type) {
      case 'logout':
        await this.authService.logout();
        break;
    }
  }
}
