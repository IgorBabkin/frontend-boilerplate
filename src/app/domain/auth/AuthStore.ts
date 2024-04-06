import { ObservableStore } from '../../../lib/observable/ObservableStore.ts';
import { IPermissions, Permission } from './IPermissions.ts';
import { perScope } from '../../../lib/scope/container.ts';
import { key, provider, register, singleton } from 'ts-ioc-container';
import { IUser } from './IUser.ts';

export const IAuthStoreKey = Symbol('IAuthStore');

@register(key(IAuthStoreKey))
@provider(perScope.application, singleton())
export class AuthStore {
  private permissions = new ObservableStore<IPermissions>({});
  private user = new ObservableStore<IUser | undefined>(undefined);
  private token = new ObservableStore<string | undefined>(undefined);

  getPermissions$() {
    return this.permissions.asObservable();
  }

  getPermissions() {
    return this.permissions.getValue();
  }

  getUser$() {
    return this.user.asObservable();
  }

  setUser(value: IUser) {
    this.user.map(() => value);
  }

  setToken(value: string) {
    this.token.map(() => value);
  }

  getToken$() {
    return this.token.asObservable();
  }

  setPermissions(value: IPermissions): void {
    this.permissions.map(() => value);
  }

  hasPermission(operation: string, permission: Permission) {
    const value = this.permissions.getValue();
    const op = value && value[operation];
    return op && op.includes(permission);
  }
}
