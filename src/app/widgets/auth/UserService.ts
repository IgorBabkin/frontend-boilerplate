import { by, IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '@domain/user/UserStore';
import { IUserRepoKey, UserRepo } from '@domain/user/UserRepo';
import { action, query } from '@lib/mediator/ICommand';
import { filter, lastValueFrom, Observable, take } from 'rxjs';
import { UserPermissions } from '@domain/user/IPermissions';
import { IUser } from '@domain/user/IUser';
import { Scope } from '@lib/scope/container';
import { accessor } from '@lib/container/utils';
import { isPresent } from '@lib/utils';
import { service } from '@lib/mediator/ServiceMediator';
import { justInvoke } from '@lib/initialize/strategies.ts';

import { onStart } from '@lib/initialize/OnInit.ts';

export interface IUserService {
  loadUser(): Promise<void>;

  getPermissions$(): Observable<UserPermissions>;

  getUser$(): Observable<IUser | undefined>;

  hasUser$(): Observable<IUser>;
}

export const IUserServiceKey = accessor<IUserService>(Symbol('IUserService'));

export const isUserLoaded$ = (c: IContainer) => lastValueFrom(IUserServiceKey.resolve(c).hasUser$());

@register(IUserServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class UserService implements IUserService {
  constructor(
    @inject(IUserStoreKey.resolve) private userStore: UserStore,
    @inject(by.key(IUserRepoKey)) private userRepo: UserRepo,
  ) {}

  @action
  @onStart(justInvoke)
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
