import { provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { UserDTO } from '@lib/api/ApiClient.ts';
import { IUser } from './IUser';
import { UserPermissions } from './IPermissions';
import { sleep } from '@lib/utils.ts';
import { IProfileRepo, IProfileRepoKey } from '@services/user/IProfileRepo.ts';

@register(IProfileRepoKey.register, scope(Scope.application))
@provider(singleton())
export class ProfileRepo implements IProfileRepo {
  static toDomain(user: UserDTO): IUser {
    return {
      nickname: user.nickname,
      permissions: new UserPermissions(user.permissions),
    };
  }

  async fetchUser(token: string): Promise<IUser> {
    await sleep(1000);
    console.log('fetching user', token);
    return ProfileRepo.toDomain({
      nickname: 'babidze',
      permissions: { todo: ['read', 'write'] },
    });
  }
}
