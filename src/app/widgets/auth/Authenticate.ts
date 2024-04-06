import { sleep } from '../../../lib/utils.ts';
import { ComponentAlias, parentOnly, perScope } from '../../../lib/scope/container.ts';
import { alias, by, inject, provider, register, visible } from 'ts-ioc-container';
import { AuthStore, IAuthStoreKey } from '../../domain/auth/AuthStore.ts';
import { ICommand } from '../../../lib/mediator/ICommand.ts';

@register(alias(ComponentAlias.onMount))
@provider(perScope.application, visible(parentOnly))
export class Authenticate implements ICommand {
  constructor(@inject(by.key(IAuthStoreKey)) private authStore: AuthStore) {}

  async execute(): Promise<void> {
    await sleep(1000);
    this.authStore.setToken('123456');
    this.authStore.setUser({ nickname: 'ironman' });
    this.authStore.setPermissions({ todo: ['read', 'write'] });
  }
}
