import { by, inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '../../domain/user/UserStore.ts';
import { IUserRepoKey, UserRepo } from '../../domain/user/UserRepo.ts';
import { command, query, service } from '../../../lib/mediator/ICommand.ts';
import { map, Observable } from 'rxjs';
import { UserPermissions } from '../../domain/user/IPermissions.ts';
import { IUser } from '../../domain/user/IUser.ts';
import { OnInit, onInit, Scope } from '../../../lib/scope/container.ts';

export const IUserServiceKey = Symbol('IUserService');

@service
@register(key(IUserServiceKey))
@provider(scope(Scope.application), singleton())
export class UserService implements OnInit {
  isInitialized = false;

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
