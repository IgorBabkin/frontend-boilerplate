import { by, IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from './UserStore';
import { IUserRepoKey, UserRepo } from './UserRepo';
import { action, query } from '@framework/components/operations';
import { filter, Observable, take } from 'rxjs';
import { UserPermissions } from './IPermissions';
import { IUser } from './IUser';
import { Scope } from '@framework/scope/container';
import { accessor } from '@core/container/utils';
import { isPresent } from '@core/utils';
import { service } from '@framework/components/ServiceProvider';

import { execute, onStart } from '@framework/initialize/OnInit';

export interface IUserService {
  loadUser(): Promise<void>;

  getPermissions$(): Observable<UserPermissions>;

  getUser$(): Observable<IUser | undefined>;

  hasUser$(): Observable<IUser>;
}

export const IUserServiceKey = accessor<IUserService>(Symbol('IUserService'));

export const isUserLoaded$ = (c: IContainer) => IUserServiceKey.resolve(c).hasUser$();

@register(IUserServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class UserService implements IUserService {
  constructor(
    @inject(IUserStoreKey.resolve) private userStore: UserStore,
    @inject(by.key(IUserRepoKey)) private userRepo: UserRepo,
  ) {}

  @action
  @onStart(execute())
  async loadUser(): Promise<void> {
    const user = await this.userRepo.fetchUser();
    this.userStore.setUser(user);
  }

  @query getPermissions$(): Observable<UserPermissions> {
    return this.userStore.getPermissions$();
  }

  @query getUser$(): Observable<IUser | undefined> {
    return this.userStore.getUser$();
  }

  @query hasUser$() {
    return this.userStore.getUser$().pipe(filter(isPresent), take(1));
  }
}
