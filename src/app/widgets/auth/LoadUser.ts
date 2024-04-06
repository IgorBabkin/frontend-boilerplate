import { by, inject } from 'ts-ioc-container';
import { ICommand } from '../../../lib/mediator/ICommand.ts';
import { IUserStoreKey, UserStore } from '../../domain/user/UserStore.ts';
import { IUserRepoKey, UserRepo } from '../../domain/user/UserRepo.ts';

export class LoadUser implements ICommand {
  constructor(
    @inject(by.key(IUserStoreKey)) private userStore: UserStore,
    @inject(by.key(IUserRepoKey)) private userRepo: UserRepo,
  ) {}

  async execute(): Promise<void> {
    const user = await this.userRepo.fetchUser();
    this.userStore.setUser(user);
  }
}
