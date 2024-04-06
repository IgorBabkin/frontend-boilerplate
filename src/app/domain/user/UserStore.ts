import { ObservableStore } from '../../../lib/observable/ObservableStore.ts';
import { Scope } from '../../../lib/scope/container.ts';
import { key, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUser } from './IUser.ts';
import { map } from 'rxjs';

export const IUserStoreKey = Symbol('IUserStore');

@register(key(IUserStoreKey))
@provider(scope(Scope.application), singleton())
export class UserStore {
  private user = new ObservableStore<IUser | undefined>(undefined);

  getPermissions$() {
    return this.user.asObservable().pipe(map((u) => u?.permissions ?? {}));
  }

  getPermissions() {
    return this.user.getValue()?.permissions ?? {};
  }

  getUser$() {
    return this.user.asObservable();
  }

  setUser(value: IUser) {
    this.user.map(() => value);
  }
}
