import { IObservableQuery } from '../../../lib/mediator/ICommand.ts';
import { by, inject } from 'ts-ioc-container';
import { AuthStore, IAuthStoreKey } from '../../domain/auth/AuthStore.ts';
import { map, Observable } from 'rxjs';
import { UserPermissions } from '../../domain/auth/IPermissions.ts';

export class GetPermissions implements IObservableQuery<void, UserPermissions> {
  constructor(@inject(by.key(IAuthStoreKey)) private authStore: AuthStore) {}

  create(): Observable<UserPermissions> {
    return this.authStore.getPermissions$().pipe(map((permissions) => new UserPermissions(permissions)));
  }
}
