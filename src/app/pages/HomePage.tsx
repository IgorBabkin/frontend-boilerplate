import Scope from '../../lib/scope/Scope.tsx';
import TodoListWidget from '../widgets/todo/TodoListWidget.tsx';
import { IUserServiceKey, UserService } from '../widgets/auth/UserService.ts';
import { useObservable } from '../../lib/observable/observable.ts';
import { useMemo } from 'react';
import { useDependency } from '../../lib/scope/ScopeContext.ts';

function HomePage() {
  const userService = useDependency<UserService>(IUserServiceKey);
  const user = useObservable(
    useMemo(() => userService.getUser$(), [userService]),
    undefined,
  );

  return (
    <div>
      <h3>Home {user?.nickname}</h3>
      {user && (
        <Scope tags="TodoListWidget">
          <TodoListWidget />
        </Scope>
      )}
    </div>
  );
}

export default HomePage;
