import { sleep } from '../utils';
import { Accessor } from '../di/utils';

function randomString(): string {
  return Math.random().toString(36).substring(7);
}

export const IAuthClientKey = new Accessor<AuthClient>('IAuthClient');

export class AuthClient {
  async login(username: string, password: string): Promise<string> {
    console.log('authenticating...', username, password);
    await sleep(1000);
    return randomString();
  }
}
