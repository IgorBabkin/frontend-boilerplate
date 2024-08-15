import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IUserRepoKey, UserRepo } from './UserRepo';
import { filter, lastValueFrom, Observable, take } from 'rxjs';
import { UserPermissions } from './IPermissions';
import { IUser } from './IUser';
import { Scope } from '@framework/scope.ts';
import { isPresent } from '@lib/utils.ts';
import { service } from '@framework/service/ServiceProvider.ts';

import { execute, onStart, onStartAsync } from '@framework/hooks/OnInit';
import { IUserService, IUserServiceKey } from './IUserService.public';
import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { subscriptionMetadata } from '@framework/hooks/Metadata.ts';
import { WatchStore } from '@lib/timeTravel/observation.ts';

const watchManager = new WatchStore();

@register(IUserServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class UserService implements IUserService {
  @onStart((context) => {
    const obs$ = context.instance[context.methodName] as Observable<unknown>;
    const id = generateID(obs$);
    const subscription = obs$.subscribe({
      next: (value) => {
        watchManager.dispatch({
          id,
          type: 'upsert',
          payload: {
            value: value,
            parent: getID(context.instance),
          },
        });
      },
      complete() {
        watchManager.dispatch({
          id,
          type: 'delete',
        });
      },
    });
    subscriptionMetadata.setMetadata(context.instance, (subscriptions) => {
      subscriptions.push(subscription);
      return subscriptions;
    });
  })
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
