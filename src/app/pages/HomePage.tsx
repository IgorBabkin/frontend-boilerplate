import TodoListWidget from '@widgets/TodoListWidget';
import UserInfoWidget from '@widgets/UserInfoWidget';
import { page } from '@framework/scope/components';

const HomePage = page(() => {
  return (
    <div>
      <UserInfoWidget />
      <TodoListWidget />
    </div>
  );
}, 'HomePage');

export default HomePage;
