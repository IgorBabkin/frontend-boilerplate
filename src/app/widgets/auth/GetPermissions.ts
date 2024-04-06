import { IObservableQuery } from '../../../lib/mediator/ICommand.ts';
import { by, inject } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '../../domain/user/UserStore.ts';
import { map, Observable } from 'rxjs';
import { UserPermissions } from '../../domain/user/IPermissions.ts';

export class GetPermissions implements IObservableQuery<void, UserPermissions> {
  constructor(@inject(by.key(IUserStoreKey)) private userStore: UserStore) {}

  create(): Observable<UserPermissions> {
    return this.userStore.getPermissions$().pipe(map((permissions) => new UserPermissions(permissions)));
  }
}
