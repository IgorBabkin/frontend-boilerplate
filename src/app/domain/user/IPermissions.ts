import { PermissionError } from './PermissionError.ts';

export type Permission = 'read' | 'write';

export type IPermissions = Record<string, Permission[]>;

export const hasPermission = (permissions: IPermissions, resource: string, permission: Permission) => {
  const rights = permissions[resource] ?? [];
  return rights.includes(permission);
};

export function checkPermission(permissions: IPermissions, resource: string, permission: Permission) {
  PermissionError.assert(
    hasPermission(permissions, resource, permission),
    `Permission denied for ${resource} ${permission}`,
  );
}

export class UserPermissions {
  constructor(private permissions: IPermissions) {}

  hasRight(resource: string, permission: Permission) {
    return hasPermission(this.permissions, resource, permission);
  }
}
