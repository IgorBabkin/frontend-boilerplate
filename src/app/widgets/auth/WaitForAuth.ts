import { by, inject } from 'ts-ioc-container';
import { AuthStore, IAuthStoreKey } from '../../domain/auth/AuthStore.ts';
import { filter, firstValueFrom } from 'rxjs';
import { ICommand } from '../../../lib/mediator/ICommand.ts';

export class WaitForAuth implements ICommand {
  constructor(@inject(by.key(IAuthStoreKey)) private authStore: AuthStore) {}

  async execute(): Promise<void> {
    await firstValueFrom(this.authStore.getToken$().pipe(filter((c) => c !== undefined)));
  }
}
