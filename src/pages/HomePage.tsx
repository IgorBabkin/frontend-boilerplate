import TodoListWidget from '../widgets/todoList/TodoListWidget.tsx';
import { Scope } from '../scope/Scope.tsx';

function HomePage() {
  return (
    <div>
      <h3>Home</h3>
      <Scope tags="widget,TodoListWidget">
        <TodoListWidget />
      </Scope>
    </div>
  );
}

export default HomePage;
