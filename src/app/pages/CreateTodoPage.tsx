import Scope from '../../lib/scope/Scope.tsx';
import AddTodoFormWidget from '../widgets/todoList/AddTodoFormWidget.tsx';

function CreateTodoPage() {
  return (
    <div>
      <h3>CreateTodo</h3>
      <Scope tags="AddTodoFormWidget">
        <AddTodoFormWidget />
      </Scope>
    </div>
  );
}

export default CreateTodoPage;
