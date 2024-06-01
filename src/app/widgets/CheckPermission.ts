import { IGuard } from '@framework/components/operations';
import { IResource, isResource } from '@modules/user/IResource';
import { alias, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '@modules/user/UserStore';
import { Permission } from '@modules/user/IPermissions';
import { CommandAlias, Scope } from '@framework/scope/container';
import { getMethodMetadata, setMethodMetadata } from '@core/hook';

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
