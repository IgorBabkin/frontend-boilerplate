import { Observable } from 'rxjs';
import { UserPermissions } from '../user/IPermissions';
import { IUser } from '../user/IUser';
import { accessor } from '@lib/di/utils.ts';

export interface IUserService {
  getPermissions(): UserPermissions;

  getUser$(): Observable<IUser | undefined>;

  isUserLoaded(): Promise<IUser>;

  loadUser(): Promise<void>;
}

export const IUserServiceKey = accessor<IUserService>(Symbol('IUserService'));

export type Permission = 'read' | 'write';
export type IPermissions = Record<string, Permission[]>;
