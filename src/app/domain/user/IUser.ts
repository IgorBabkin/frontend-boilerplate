import { IPermissions } from './IPermissions.ts';

export interface IUser {
  nickname: string;
  permissions: IPermissions;
}
