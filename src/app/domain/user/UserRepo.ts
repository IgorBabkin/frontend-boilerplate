import { inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@lib/scope/container.ts';
import { ApiClient, IApiClientKey, UserDTO } from '../../api/ApiClient.ts';
import { Context } from '@lib/scope/Context.ts';
import { IUser } from './IUser.ts';
import { UserPermissions } from './IPermissions.ts';

export const IUserRepoKey = Symbol('IUserRepo');

@register(key(IUserRepoKey))
@provider(scope(Scope.application), singleton())
export class UserRepo {
  static toDomain(user: UserDTO): IUser {
    return {
      nickname: user.nickname,
      permissions: new UserPermissions(user.permissions),
    };
  }

  constructor(@inject(IApiClientKey.resolve) private apiClient: Context<ApiClient>) {}

  async fetchUser(): Promise<IUser> {
    const user = await this.apiClient.getValueOrFail().getUser();
    return UserRepo.toDomain(user);
  }
}
