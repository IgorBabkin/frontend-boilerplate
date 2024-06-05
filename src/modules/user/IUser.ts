import { UserPermissions } from './IPermissions';

export interface IUser {
  nickname: string;
  permissions: UserPermissions;
}
