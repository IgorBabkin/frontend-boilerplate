import { IObservableQuery } from '../../../lib/mediator/ICommand.ts';
import { by, inject } from 'ts-ioc-container';
import { AuthStore, IAuthStoreKey } from '../../domain/auth/AuthStore.ts';
import { Observable } from 'rxjs';
import { IPermissions } from '../../domain/auth/IPermissions.ts';

export class GetPermissions implements IObservableQuery<void, IPermissions> {
  constructor(@inject(by.key(IAuthStoreKey)) private authStore: AuthStore) {}

  create(): Observable<IPermissions> {
    return this.authStore.getPermissions$();
  }
}
