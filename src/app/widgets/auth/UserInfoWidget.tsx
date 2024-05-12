import { IUserServiceKey } from './UserService.ts';
import { useObservable } from '@lib/observable/observable.ts';
import { widget } from '@lib/scope/components.tsx';

import { useDependency } from '@lib/scope/ScopeContext.ts';

const UserInfoWidget = widget(() => {
  const userService = useDependency(IUserServiceKey.resolve);
  const user = useObservable(() => userService.getUser$(), undefined, [userService]);

  return (
    <>
      {user && <h3>Hello {user?.nickname}</h3>}
      {!user && <h4>Loading...</h4>}
    </>
  );
}, 'UserInfoWidget');

export default UserInfoWidget;
