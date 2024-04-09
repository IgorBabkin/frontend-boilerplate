import { by, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '../../domain/user/UserStore.ts';
import { IUserRepoKey, UserRepo } from '../../domain/user/UserRepo.ts';
import { command, query } from '../../../lib/mediator/ICommand.ts';
import { map, Observable } from 'rxjs';
import { UserPermissions } from '../../domain/user/IPermissions.ts';
import { IUser } from '../../domain/user/IUser.ts';
import { Scope } from '../../../lib/scope/container.ts';
import { onInit } from '../../../lib/scope/OnInit.ts';
import { service } from '../../../lib/mediator/ServiceProvider.ts';
import { accessor } from '../../../lib/container/utils.ts';

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
    @inject(IUserStoreKey.get) private userStore: UserStore,
    @inject(by.key(IUserRepoKey)) private userRepo: UserRepo,
  ) {}

  @onInit
  @command
  async loadUser(): Promise<void> {
    const user = await this.userRepo.fetchUser();
    this.userStore.setUser(user);
  }

  @query getPermissions$(): Observable<UserPermissions> {
    return this.userStore.getPermissions$().pipe(map((permissions) => new UserPermissions(permissions)));
  }

  @query getUser$(): Observable<IUser | undefined> {
    return this.userStore.getUser$();
  }
}
