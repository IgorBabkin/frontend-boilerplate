import { useDependency } from '@lib/scope/ScopeContext.ts';
import { IUserServiceKey } from './UserService.ts';
import { useObservable } from '@lib/observable/observable.ts';
import { ScopeProps, withScope } from '@lib/scope/ScopeHOCs.tsx';

const UserInfoWidget = withScope(() => {
  const userService = useDependency(IUserServiceKey.resolve);
  const user = useObservable(() => userService.getUser$(), undefined, [userService]);

  return (
    <>
      {user && <h3>Hello {user?.nickname}</h3>}
      {!user && <h4>Loading...</h4>}
    </>
  );
}, ScopeProps.widget('UserInfoWidget'));

export default UserInfoWidget;
