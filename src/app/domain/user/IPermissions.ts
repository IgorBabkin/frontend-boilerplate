import { PermissionError } from './PermissionError.ts';

export type Permission = 'read' | 'write';

export type IPermissions = Record<string, Permission[]>;

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
