import { IGuard } from '@framework/guard/IGuard.ts';
import { IResource, isResource } from '@modules/user/IResource';
import { alias, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '@modules/user/UserStore';
import { CommandAlias, Scope } from '@framework/scope.ts';
import { getMethodMetadata, setMethodMetadata } from '../../lib/reflection/hook';
import { Permission } from '@modules/user/IUserService.public';

@register(scope(Scope.application))
@provider(singleton(), alias(CommandAlias.onBeforeExecution))
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
