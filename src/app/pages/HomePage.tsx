import TodoListWidget from '@widgets/todo/TodoListWidget.tsx';
import UserInfoWidget from '@widgets/auth/UserInfoWidget.tsx';
import { ScopeProps, withScope } from '@lib/scope/ScopeHOCs.tsx';

const HomePage = withScope(() => {
  return (
    <div>
      <UserInfoWidget />
      <TodoListWidget />
    </div>
  );
}, ScopeProps.page('HomePage'));

export default HomePage;
