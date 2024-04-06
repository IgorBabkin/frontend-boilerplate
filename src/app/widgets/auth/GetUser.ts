import { Observable } from 'rxjs';
import { IUserStoreKey, UserStore } from '../../domain/user/UserStore.ts';
import { by, inject } from 'ts-ioc-container';
import { IObservableQuery } from '../../../lib/mediator/ICommand.ts';
import { IUser } from '../../domain/user/IUser.ts';

export class GetUser implements IObservableQuery<void, IUser | undefined> {
  constructor(@inject(by.key(IUserStoreKey)) private userStore: UserStore) {}

  create(): Observable<IUser | undefined> {
    return this.userStore.getUser$();
  }
}
