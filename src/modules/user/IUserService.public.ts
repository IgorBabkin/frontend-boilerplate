import { Observable } from 'rxjs';
import { UserPermissions } from '@modules/user/IPermissions';
import { IUser } from '@modules/user/IUser';
import { Accessor } from '../../lib/di/utils';

export interface IUserService {
  loadUser(): Promise<void>;

  getPermissions$(): Observable<UserPermissions>;

  getUser$(): Observable<IUser | undefined>;

  hasUser$(): Observable<IUser>;
}

export const IUserServiceKey = new Accessor<IUserService>(Symbol('IUserService'));

export type Permission = 'read' | 'write';
export type IPermissions = Record<string, Permission[]>;
