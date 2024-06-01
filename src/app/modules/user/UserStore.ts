import { ObservableStore } from '@core/observable/ObservableStore';
import { Scope } from '@framework/scope/container';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { IUser } from './IUser';
import { map } from 'rxjs';
import { accessor } from '@core/container/utils';
import { UserPermissions } from './IPermissions';

export const IUserStoreKey = accessor<UserStore>(Symbol('IUserStore'));

@register(IUserStoreKey.register, scope(Scope.application))
@provider(singleton())
export class UserStore {
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
