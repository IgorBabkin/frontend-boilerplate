import { IUser } from '@services/user/IUser.ts';
import { accessor } from '@lib/di/utils.ts';
import { ProfileRepo } from '@services/user/ProfileRepo.ts';

export interface IProfileRepo {
  fetchUser(token: string): Promise<IUser>;
}

export const IProfileRepoKey = accessor<ProfileRepo>('IProfileRepo');
