import { Permission } from './IPermissions.ts';

export interface IResource {
  resource: string;
  permission: Permission;
  checkOnInit?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isResource(value: any): value is IResource {
  return value && typeof value.resource === 'string' && typeof value.permission === 'string';
}
