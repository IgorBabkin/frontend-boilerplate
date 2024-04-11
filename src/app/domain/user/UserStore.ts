import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { Scope } from '@lib/scope/container.ts';
import { provider, register, scope, singleton } from 'ts-ioc-container';
import { IUser } from './IUser.ts';
import { map } from 'rxjs';
import { accessor } from '@lib/container/utils.ts';
import { UserPermissions } from './IPermissions.ts';

export const IUserStoreKey = accessor<UserStore>(Symbol('IUserStore'));

@register(IUserStoreKey.register)
@provider(scope(Scope.application), singleton())
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
