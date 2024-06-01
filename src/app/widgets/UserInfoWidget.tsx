import { IUserServiceKey } from '@modules/user/UserService';
import { useObservable } from '@core/observable/observable';
import { widget } from '@framework/scope/components';

import { useDependency } from '@framework/scope/ScopeContext';

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
