import { ICommand } from '../../../lib/mediator/ICommand.ts';
import { IResource, isResource } from '../../domain/user/IResource.ts';
import { alias, by, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '../../domain/user/UserStore.ts';
import { checkPermission } from '../../domain/user/IPermissions.ts';
import { CommandAlias, Scope } from '../../../lib/scope/container.ts';

@register(alias(CommandAlias.onBeforeExecution))
@provider(scope(Scope.application), singleton())
export class CheckPermission implements ICommand<IResource> {
  constructor(@inject(by.key(IUserStoreKey)) private userStore: UserStore) {}

  match(resource: unknown): resource is IResource {
    return isResource(resource);
  }

  async execute(resource: IResource): Promise<void> {
    const permissions = this.userStore.getPermissions();
    checkPermission(permissions, resource);
  }
}
