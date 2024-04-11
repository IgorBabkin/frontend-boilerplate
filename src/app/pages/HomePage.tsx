import Scope from '@lib/scope/Scope.tsx';
import TodoListWidget from '../widgets/todo/TodoListWidget.tsx';
import { IUserServiceKey } from '../widgets/auth/UserService.ts';
import { useObservable } from '@lib/observable/observable.ts';
import { useDependency } from '@lib/scope/ScopeContext.ts';
import UserInfoWidget from '../widgets/auth/UserInfoWidget.tsx';

function HomePage() {
  const userService = useDependency(IUserServiceKey.resolve);
  const user = useObservable(() => userService.getUser$(), undefined, [userService]);

  return (
    <div>
      <UserInfoWidget />
      {user && (
        <Scope tags="widget">
          <TodoListWidget />
        </Scope>
      )}
    </div>
  );
}

export default HomePage;
