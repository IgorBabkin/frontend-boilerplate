import Scope from '../../lib/scope/Scope.tsx';
import TodoListWidget from '../widgets/todo/TodoListWidget.tsx';
import { useQuery } from '../../lib/scope/useQuery.ts';
import { GetUser } from '../widgets/auth/GetUser.ts';

function HomePage() {
  const user = useQuery(GetUser, undefined, undefined);
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
