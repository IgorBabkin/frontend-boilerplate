import { UserPermissions } from './IPermissions.ts';

export interface IUser {
  nickname: string;
  permissions: UserPermissions;
}
