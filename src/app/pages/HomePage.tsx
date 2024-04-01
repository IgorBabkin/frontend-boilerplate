import TodoListWidget from '../widgets/todoList/TodoListWidget.tsx';
import Scope from '../../lib/scope/Scope.tsx';

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
