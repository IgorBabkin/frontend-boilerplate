import { ArgsFn, by, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { isUserPresent, IUserStoreKey, UserStore } from '@domain/user/UserStore.ts';
import { IUserRepoKey, UserRepo } from '@domain/user/UserRepo.ts';
import { action, query } from '@lib/mediator/ICommand.ts';
import { filter, Observable, take } from 'rxjs';
import { UserPermissions } from '@domain/user/IPermissions.ts';
import { IUser } from '@domain/user/IUser.ts';
import { Scope } from '@lib/scope/container.ts';
import { onInit } from '@lib/mediator/OnInit.ts';
import { service } from '@lib/mediator/ServiceProvider.ts';
import { accessor } from '@lib/container/utils.ts';

export const isUserLoaded$: ArgsFn = (c) => [IUserServiceKey.resolve(c).hasUser$()];

export interface IUserService {
  loadUser(): Promise<void>;

  getPermissions$(): Observable<UserPermissions>;

  getUser$(): Observable<IUser | undefined>;

  hasUser$(): Observable<IUser>;
}

export const IUserServiceKey = accessor<IUserService>(Symbol('IUserService'));

@register(IUserServiceKey.register)
@provider(service, scope(Scope.application), singleton())
export class UserService implements IUserService {
  constructor(
    @inject(IUserStoreKey.resolve) private userStore: UserStore,
    @inject(by.key(IUserRepoKey)) private userRepo: UserRepo,
  ) {}

  @onInit
  @action
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
    return this.userStore.getUser$().pipe(filter(isUserPresent), take(1));
  }
}
