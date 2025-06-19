import { inject, register, scope, singleton } from 'ts-ioc-container';
import { ProfileRepo } from './ProfileRepo.ts';
import { BehaviorSubject, filter, lastValueFrom, take } from 'rxjs';
import { UserPermissions } from './IPermissions';
import { IUser } from './IUser';
import { Scope } from '@framework/scope.ts';
import { isPresent } from '@lib/utils.ts';
import { IUserStore, IUserStoreKey } from './IUserService.public';
import { type IAuthStore, IAuthStoreKey } from '@services/auth/IAuthStore.ts';
import { IProfileRepoKey } from '@services/user/IProfileRepo.ts';
import { onInitAsync } from '@framework/hooks/OnInit.ts';
import { Store } from '@framework/service/Store.ts';
import { execute } from '@framework/hooks/initHooks.ts';

@register(IUserStoreKey, scope(Scope.application), singleton())
export class UserService extends Store implements IUserStore {
  user$ = new BehaviorSubject<IUser | null>(null);

  constructor(
    @inject(IProfileRepoKey.resolve) private userRepo: ProfileRepo,
    @inject(IAuthStoreKey.resolve) private authService: IAuthStore,
  ) {
    super();
  }

  @onInitAsync(execute())
  async loadUser(): Promise<void> {
    const token = this.authService.getTokenOrFail();
    const user = await this.userRepo.fetchUser(token);
    this.user$.next(user);
  }

  getPermissions(): UserPermissions {
    return this.user$.getValue()?.permissions ?? UserPermissions.default;
  }

  isUserLoaded(): Promise<IUser> {
    return lastValueFrom(this.user$.pipe(filter(isPresent), take(1)));
  }
}
