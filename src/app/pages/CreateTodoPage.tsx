import AddTodoFormWidget from '../widgets/todo/AddTodoFormWidget.tsx';
import { page } from '@lib/scope/components.tsx';

const CreateTodoPage = page(() => {
  return (
    <div>
      <h3>CreateTodo</h3>
      <AddTodoFormWidget />
    </div>
  );
}, 'CreateTodoPage');

export default CreateTodoPage;
