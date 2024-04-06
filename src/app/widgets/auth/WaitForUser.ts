import { by, inject } from 'ts-ioc-container';
import { IUserStoreKey, UserStore } from '../../domain/user/UserStore.ts';
import { filter, firstValueFrom } from 'rxjs';
import { ICommand } from '../../../lib/mediator/ICommand.ts';

export class WaitForUser implements ICommand {
  constructor(@inject(by.key(IUserStoreKey)) private userStore: UserStore) {}

  async execute(): Promise<void> {
    await firstValueFrom(this.userStore.getUser$().pipe(filter((c) => c !== undefined)));
  }
}
