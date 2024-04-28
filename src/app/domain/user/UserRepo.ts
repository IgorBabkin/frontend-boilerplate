import { key, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@lib/scope/container.ts';
import { UserDTO } from '../../api/ApiClient.ts';
import { IUser } from './IUser.ts';
import { UserPermissions } from './IPermissions.ts';
import { sleep } from '@lib/utils.ts';

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
