import { Observable } from 'rxjs';
import { UserPermissions } from '../user/IPermissions';
import { IUser } from '../user/IUser';
import { depKey } from 'ts-ioc-container';

export interface IUserStore {
  getPermissions(): UserPermissions;

  user$: Observable<IUser | null>;

  isUserLoaded(): Promise<IUser>;

  loadUser(): Promise<void>;
}

export const IUserStoreKey = depKey<IUserStore>('IUserStore');

export type Permission = 'read' | 'write';
export type IPermissions = Record<string, Permission[]>;
