import Scope from '../../lib/scope/Scope.tsx';
import AddTodoFormWidget from '../widgets/todo/AddTodoFormWidget.tsx';

function CreateTodoPage() {
  return (
    <div>
      <h3>CreateTodo</h3>
      <Scope tags="widget">
        <AddTodoFormWidget />
      </Scope>
    </div>
  );
}

export default CreateTodoPage;
