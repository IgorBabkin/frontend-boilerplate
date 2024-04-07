import Scope from '../../lib/scope/Scope.tsx';
import TodoListWidget from '../widgets/todo/TodoListWidget.tsx';
import { UserController } from '../widgets/auth/UserController.ts';
import { useController } from '../../lib/scope/useQuery.ts';
import { useObservable } from '../../lib/observable/observable.ts';
import { useMemo } from 'react';

function HomePage() {
  const userController = useController(UserController);
  const user = useObservable(
    useMemo(() => userController.getUser$(), [userController]),
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
