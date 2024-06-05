import { ObservableStore } from '../../lib/observable/ObservableStore';
import { Scope } from '@framework/scope.ts';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { IUser } from './IUser';
import { map, Observable } from 'rxjs';
import { UserPermissions } from './IPermissions';
import { Accessor } from '../../lib/di/utils';

export interface IUserStore {
  getPermissions$(): Observable<UserPermissions>;

  getPermissions(): UserPermissions;

  getUser$(): Observable<IUser | undefined>;

  setUser(value: IUser): void;
}

export const IUserStoreKey = new Accessor<UserStore>('IUserStore');

@register(IUserStoreKey.register, scope(Scope.application))
@provider(singleton())
export class UserStore implements IUserStore {
  private user = new ObservableStore<IUser | undefined>(undefined);

  getPermissions$() {
    return this.user.asObservable().pipe(map((u) => u?.permissions ?? UserPermissions.default));
  }

  getPermissions() {
    return this.user.getValue()?.permissions ?? UserPermissions.default;
  }

  getUser$() {
    return this.user.asObservable();
  }

  setUser(value: IUser) {
    this.user.map(() => value);
  }
}
