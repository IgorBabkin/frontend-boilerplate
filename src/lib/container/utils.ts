import { by, DependencyKey, key } from 'ts-ioc-container';

export function accessor<T>(token: DependencyKey) {
  return {
    register: key(token),
    key: token,
    get: by.key<T>(token),
  };
}
