import { beforeExecution, ICommand } from '../../../lib/mediator/ICommand.ts';
import { IResource, isResource } from '../../domain/auth/IResource.ts';
import { alias, by, inject, provider, register, singleton } from 'ts-ioc-container';
import { AuthStore, IAuthStoreKey } from '../../domain/auth/AuthStore.ts';
import { checkPermission } from '../../domain/auth/IPermissions.ts';
import { CommandAlias, perScope } from '../../../lib/scope/container.ts';
import { WaitForAuth } from './WaitForAuth.ts';

@register(alias(CommandAlias.onConstruct, CommandAlias.onBeforeExecution))
@beforeExecution(WaitForAuth)
@provider(perScope.application, singleton())
export class CheckPermission implements ICommand<IResource> {
  constructor(@inject(by.key(IAuthStoreKey)) private authStore: AuthStore) {}

  match(resource: unknown): resource is IResource {
    return isResource(resource);
  }

  async execute(resource: IResource): Promise<void> {
    const permissions = this.authStore.getPermissions();
    checkPermission(permissions, resource);
  }
}
