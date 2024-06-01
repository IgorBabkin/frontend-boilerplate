import AddTodoFormWidget from '@widgets/AddTodoFormWidget';
import { page } from '@framework/scope/components';

const CreateTodoPage = page(() => {
  return (
    <div>
      <h3>CreateTodo</h3>
      <AddTodoFormWidget />
    </div>
  );
}, 'CreateTodoPage');

export default CreateTodoPage;
