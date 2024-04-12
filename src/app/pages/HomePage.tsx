import TodoListWidget from '@widgets/todo/TodoListWidget.tsx';
import UserInfoWidget from '@widgets/auth/UserInfoWidget.tsx';
import { page } from '@lib/scope/ScopeHOCs.tsx';

const HomePage = page(() => {
  return (
    <div>
      <UserInfoWidget />
      <TodoListWidget />
    </div>
  );
}, 'HomePage');

export default HomePage;
