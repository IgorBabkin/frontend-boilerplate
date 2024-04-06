import Scope from '../../lib/scope/Scope.tsx';
import TodoListWidget from '../widgets/todo/TodoListWidget.tsx';
import { useQuery } from '../../lib/scope/useQuery.ts';
import { GetUser } from '../widgets/auth/GetUser.ts';

function HomePage() {
  const config = useQuery(GetUser, undefined, undefined);
  return (
    <div>
      <h3>Home {config?.nickname}</h3>
      <Scope tags="TodoListWidget">
        <TodoListWidget />
      </Scope>
    </div>
  );
}

export default HomePage;
