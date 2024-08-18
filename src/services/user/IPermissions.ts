import { PermissionError } from '@framework/errors/PermissionError.ts';
import { IPermissions, Permission } from './IUserService.public';

export class UserPermissions {
  static default = new UserPermissions({});

  constructor(private permissions: IPermissions) {}

  hasRight(resource: string, permission: Permission) {
    return this.getRights(resource).includes(permission);
  }

  checkPermission(resource: string, permission: Permission) {
    PermissionError.assert(
      this.getRights(resource).includes(permission),
      `Permission denied for ${resource} ${permission}`,
    );
  }

  private getRights(resource: string): Permission[] {
    return this.permissions[resource] ?? [];
  }
}
