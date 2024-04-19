import { IGuard } from '@lib/mediator/ICommand.ts';
import { IResource, isResource } from '@domain/user/IResource.ts';
import { alias, inject, register, scope, singleton } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '@domain/user/UserStore.ts';
import { Permission } from '@domain/user/IPermissions.ts';
import { CommandAlias, Scope } from '@lib/scope/container.ts';
import { getMethodMetadata, setMethodMetadata } from '@lib/hook.ts';

@register(alias(CommandAlias.onBeforeExecution), scope(Scope.application), singleton())
export class CheckPermission implements IGuard {
  constructor(@inject(IUserStoreKey.resolve) private userStore: UserStore) {}

  match(resource: unknown): resource is IResource {
    return isResource(resource);
  }

  execute(service: IResource, method: string): void {
    const permission = getPermission(service, method);
    if (permission === undefined) {
      return;
    }
    const permissions = this.userStore.getPermissions();
    permissions.checkPermission(service.resource, permission);
  }
}

export const permission = (value: Permission) => setMethodMetadata('permission', value);
export const getPermission = (target: object, propertyKey: string) =>
  getMethodMetadata('permission', target, propertyKey) as Permission | undefined;
