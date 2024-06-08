import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserRepoKey, UserRepo } from './UserRepo';
import { filter, lastValueFrom, Observable, take } from 'rxjs';
import { UserPermissions } from './IPermissions';
import { IUser } from './IUser';
import { Scope } from '@framework/scope.ts';
import { isPresent } from '@lib/utils.ts';
import { service } from '@framework/service/ServiceProvider.ts';

import { execute, onStartAsync } from '@framework/hooks/OnInit';
import { IUserService, IUserServiceKey } from './IUserService.public';
import { ObservableStore } from '@lib/observable/ObservableStore.ts';

@register(IUserServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class UserService implements IUserService {
  private user$ = new ObservableStore<IUser | undefined>(undefined);

  constructor(@inject(IUserRepoKey.resolve) private userRepo: UserRepo) {}

  @onStartAsync(execute())
  async loadUser(): Promise<void> {
    const user = await this.userRepo.fetchUser();
    this.user$.setValue(user);
  }

  getPermissions(): UserPermissions {
    return this.user$.getValue()?.permissions ?? UserPermissions.default;
  }

  getUser$(): Observable<IUser | undefined> {
    return this.user$.asObservable();
  }

  isUserLoaded() {
    return lastValueFrom(this.user$.asObservable().pipe(filter(isPresent), take(1)));
  }
}
