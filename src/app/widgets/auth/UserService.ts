import { by, inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '../../domain/user/UserStore.ts';
import { IUserRepoKey, UserRepo } from '../../domain/user/UserRepo.ts';
import { command, query } from '../../../lib/mediator/ICommand.ts';
import { map, Observable } from 'rxjs';
import { UserPermissions } from '../../domain/user/IPermissions.ts';
import { IUser } from '../../domain/user/IUser.ts';
import { Scope } from '../../../lib/scope/container.ts';
import { onInit } from '../../../lib/scope/OnInit.ts';
import { service } from '../../../lib/mediator/ServiceProvider.ts';

export const IUserServiceKey = Symbol('IUserService');

@register(key(IUserServiceKey))
@provider(service, scope(Scope.application), singleton())
export class UserService {
  constructor(
    @inject(by.key(IUserStoreKey)) private userStore: UserStore,
    @inject(by.key(IUserRepoKey)) private userRepo: UserRepo,
  ) {}

  @onInit
  @command
  async loadUser(): Promise<void> {
    const user = await this.userRepo.fetchUser();
    this.userStore.setUser(user);
  }

  @query
  getPermissions$(): Observable<UserPermissions> {
    return this.userStore.getPermissions$().pipe(map((permissions) => new UserPermissions(permissions)));
  }

  @query
  getUser$(): Observable<IUser | undefined> {
    return this.userStore.getUser$();
  }
}
