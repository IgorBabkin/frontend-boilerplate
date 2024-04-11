import Scope from '@lib/scope/Scope.tsx';
import TodoListWidget from '@widgets/todo/TodoListWidget.tsx';
import UserInfoWidget from '@widgets/auth/UserInfoWidget.tsx';

function HomePage() {
  return (
    <div>
      <UserInfoWidget />
      <Scope tags="widget">
        <TodoListWidget />
      </Scope>
    </div>
  );
}

export default HomePage;
