import { useObservable } from '@helpers/observable';
import { widget } from '@helpers/scope/components';

import { useDependency } from '@helpers/scope/ScopeContext';
import { IUserServiceKey } from '@modules/user/IUserService.public';

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
