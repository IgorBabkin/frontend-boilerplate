import { by, inject } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '../../domain/user/UserStore.ts';
import { IUserRepoKey, UserRepo } from '../../domain/user/UserRepo.ts';
import { command, query } from '../../../lib/mediator/ICommand.ts';
import { map, Observable } from 'rxjs';
import { UserPermissions } from '../../domain/user/IPermissions.ts';
import { IUser } from '../../domain/user/IUser.ts';

export class UserController {
  constructor(
    @inject(by.key(IUserStoreKey)) private userStore: UserStore,
    @inject(by.key(IUserRepoKey)) private userRepo: UserRepo,
  ) {}

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
