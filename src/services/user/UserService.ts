import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { ProfileRepo } from './ProfileRepo.ts';
import { filter, lastValueFrom, Observable, take } from 'rxjs';
import { UserPermissions } from './IPermissions';
import { IUser } from './IUser';
import { Scope } from '@framework/scope.ts';
import { isPresent } from '@lib/utils.ts';
import { IUserService, IUserServiceKey } from './IUserService.public';
import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { type IAuthService, IAuthServiceKey } from '@services/auth/IAuthService.public.ts';
import { IProfileRepoKey } from '@services/user/IProfileRepo.ts';
import { execute, onInitAsync } from '@framework/hooks/OnInit.ts';
import { Service } from '@framework/service/Service.ts';

@provider(singleton())
@register(IUserServiceKey.register, scope(Scope.application))
export class UserService extends Service implements IUserService {
  private user$ = new ObservableStore<IUser | undefined>(undefined);

  constructor(
    @inject(IProfileRepoKey.resolve) private userRepo: ProfileRepo,
    @inject(IAuthServiceKey.resolve) private authService: IAuthService,
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

  getUser$(): Observable<IUser | undefined> {
    return this.user$.asObservable();
  }

  isUserLoaded() {
    return lastValueFrom(this.user$.pipe(filter(isPresent), take(1)));
  }
}
