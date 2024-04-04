import Scope from '../../lib/scope/Scope.tsx';
import TodoListWidget from '../widgets/todo/TodoListWidget.tsx';
import { GetConfig } from '../widgets/config/GetConfig.ts';
import { useQuery } from '../../lib/scope/useQuery.ts';

function HomePage() {
  const config = useQuery(GetConfig, undefined, undefined);
  return (
    <div>
      <h3>Home {config?.theme}</h3>
      <Scope tags="TodoListWidget">
        <TodoListWidget />
      </Scope>
    </div>
  );
}

export default HomePage;
