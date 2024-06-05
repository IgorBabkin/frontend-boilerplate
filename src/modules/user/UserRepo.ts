import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { UserDTO } from '../../lib/api/ApiClient';
import { IUser } from './IUser';
import { UserPermissions } from './IPermissions';
import { sleep } from '../../lib/utils';
import { Accessor } from '../../lib/di/utils';

export const IUserRepoKey = new Accessor<UserRepo>('IUserRepo');

@register(IUserRepoKey.register, scope(Scope.application))
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
