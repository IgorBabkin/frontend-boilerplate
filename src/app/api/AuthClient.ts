import { sleep } from '../../lib/utils.ts';
import { accessor } from '../../lib/container/utils.ts';

function randomString(): string {
  return Math.random().toString(36).substring(7);
}

export const IAuthClientKey = accessor<AuthClient>(Symbol('IAuthClient'));

export class AuthClient {
  async login(username: string, password: string): Promise<string> {
    console.log('authenticating...', username, password);
    await sleep(1000);
    return randomString();
  }
}
