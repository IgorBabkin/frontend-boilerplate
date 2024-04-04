import Scope from '../../lib/scope/Scope.tsx';
import TodoListWidget from '../widgets/todo/TodoListWidget.tsx';

function HomePage() {
  return (
    <div>
      <h3>Home</h3>
      <Scope tags="TodoListWidget">
        <TodoListWidget />
      </Scope>
    </div>
  );
}

export default HomePage;
