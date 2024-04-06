import { IResource } from './IResource.ts';
import { PermissionError } from './PermissionError.ts';

export type Permission = 'read' | 'write';

export type IPermissions = Record<string, Permission[]>;

export const hasPermission = (permissions: IPermissions, resource: string, permission: Permission) => {
  const rights = permissions[resource] ?? [];
  return rights.includes(permission);
};

export function checkPermission(permissions: IPermissions, { resource, permission }: IResource) {
  PermissionError.assert(
    hasPermission(permissions, resource, permission),
    `Permission denied for ${resource} ${permission}`,
  );
}
