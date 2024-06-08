import { IGuard } from '@framework/guard/IGuard.ts';
import { IResource, isResource } from '../services/user/IResource.ts';
import { alias, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { CommandAlias, Scope } from '@framework/scope.ts';
import { getMethodMetadata, setMethodMetadata } from '@lib/reflection/hook.ts';
import { type IUserService, IUserServiceKey, Permission } from '../services/user/IUserService.public.ts';

@register(scope(Scope.application))
@provider(singleton(), alias(CommandAlias.onBeforeExecution))
export class CheckPermission implements IGuard {
  constructor(@inject(IUserServiceKey.resolve) private userService: IUserService) {}

  match(resource: unknown): resource is IResource {
    return isResource(resource);
  }

  execute(service: IResource, method: string): void {
    const permission = getPermission(service, method);
    if (permission === undefined) {
      return;
    }
    const permissions = this.userService.getPermissions();
    permissions.checkPermission(service.resource, permission);
  }
}

export const permission = (value: Permission) => setMethodMetadata('permission', value);
export const getPermission = (target: object, propertyKey: string) =>
  getMethodMetadata('permission', target, propertyKey) as Permission | undefined;
