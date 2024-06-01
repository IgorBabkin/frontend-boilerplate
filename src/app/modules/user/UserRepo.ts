import { key, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope/container';
import { UserDTO } from '@core/api/ApiClient';
import { IUser } from './IUser';
import { UserPermissions } from './IPermissions';
import { sleep } from '@core/utils';

export const IUserRepoKey = Symbol('IUserRepo');

@register(key(IUserRepoKey), scope(Scope.application))
@provider(singleton())
export class UserRepo {
  static toDomain(user: UserDTO): IUser {
    return {
      nickname: user.nickname,
      permissions: new UserPermissions(user.permissions),
    };
  }

  async fetchUser(): Promise<IUser> {
    await sleep(1000);
    return UserRepo.toDomain({
      nickname: 'babidze',
      permissions: { todo: ['read', 'write'] },
    });
  }
}
