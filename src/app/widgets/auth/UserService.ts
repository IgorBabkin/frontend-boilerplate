import { by, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '../../domain/user/UserStore.ts';
import { IUserRepoKey, UserRepo } from '../../domain/user/UserRepo.ts';
import { action, query } from '@lib/mediator/ICommand.ts';
import { Observable } from 'rxjs';
import { UserPermissions } from '../../domain/user/IPermissions.ts';
import { IUser } from '../../domain/user/IUser.ts';
import { Scope } from '@lib/scope/container.ts';
import { onInit } from '@lib/scope/OnInit.ts';
import { service } from '@lib/mediator/ServiceProvider.ts';
import { accessor } from '@lib/container/utils.ts';

export const IUserServiceKey = accessor<IUserService>(Symbol('IUserService'));

export interface IUserService {
  loadUser(): Promise<void>;

  getPermissions$(): Observable<UserPermissions>;

  getUser$(): Observable<IUser | undefined>;
}

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
}
