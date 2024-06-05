import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from './UserStore';
import { IUserRepoKey, UserRepo } from './UserRepo';
import { filter, Observable, take } from 'rxjs';
import { UserPermissions } from './IPermissions';
import { IUser } from './IUser';
import { Scope } from '@framework/scope.ts';
import { isPresent } from '../../lib/utils';
import { service } from '@framework/service/ServiceProvider.ts';

import { execute, onStart } from '@framework/hooks/OnInit';
import { IUserService, IUserServiceKey } from './IUserService.public';
import { action, query } from '@framework/service/metadata.ts';

@register(IUserServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class UserService implements IUserService {
  constructor(
    @inject(IUserStoreKey.resolve) private userStore: UserStore,
    @inject(IUserRepoKey.resolve) private userRepo: UserRepo,
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
