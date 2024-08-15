import { useObservable } from '@helpers/observable';
import { widget } from '@helpers/scope/components';

import { useDependency } from '@helpers/scope/ScopeContext';
import { IUserControllerKey } from '@operations/user/IUserController.ts';

const UserInfoWidget = widget(() => {
  const userController = useDependency(IUserControllerKey.resolve);
  const user = useObservable(() => userController.getUser$(), undefined, [userController]);

  if (!user) {
    return <h4>Loading...</h4>;
  }

  return <h3>Hello {user?.nickname}</h3>;
}, 'UserInfoWidget');

export default UserInfoWidget;
