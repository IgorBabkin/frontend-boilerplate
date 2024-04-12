import AddTodoFormWidget from '../widgets/todo/AddTodoFormWidget.tsx';
import { ScopeProps, withScope } from '@lib/scope/ScopeHOCs.tsx';

const CreateTodoPage = withScope(() => {
  return (
    <div>
      <h3>CreateTodo</h3>
      <AddTodoFormWidget />
    </div>
  );
}, ScopeProps.page('CreateTodoPage'));

export default CreateTodoPage;
