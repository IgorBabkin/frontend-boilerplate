import { by, inject } from 'ts-ioc-container';
import { ICommand } from '../../../lib/mediator/ICommand.ts';
import { AuthService, IAuthServiceKey } from '../../domain/auth/AuthService.ts';
import { Context } from '../../../lib/scope/Context.ts';
import { ApiClient, IApiClientKey } from '../../api/ApiClient.ts';

export class Authenticate implements ICommand {
  constructor(
    @inject(by.key(IAuthServiceKey)) private authService: AuthService,
    @inject(by.key(IApiClientKey)) private apiClientContext: Context<ApiClient>,
  ) {}

  async execute(): Promise<void> {
    const token = await this.authService.login('ironman@marvel.com', '12345');
    this.apiClientContext.setValue(new ApiClient(token));
  }
}
