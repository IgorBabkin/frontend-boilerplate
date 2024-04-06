import { Observable } from 'rxjs';
import { AuthStore, IAuthStoreKey } from '../../domain/auth/AuthStore.ts';
import { by, inject } from 'ts-ioc-container';
import { IObservableQuery } from '../../../lib/mediator/ICommand.ts';
import { IUser } from '../../domain/auth/IUser.ts';

export class GetUser implements IObservableQuery<void, IUser | undefined> {
  constructor(@inject(by.key(IAuthStoreKey)) private authStore: AuthStore) {}

  create(): Observable<IUser | undefined> {
    return this.authStore.getUser$();
  }
}
