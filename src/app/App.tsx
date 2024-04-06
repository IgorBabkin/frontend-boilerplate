import './App.css';
import { Outlet } from 'react-router-dom';
import { useAsyncEffect, useCommand, useQuery } from '../lib/scope/useQuery.ts';
import { GetErrors } from './widgets/errors/GetErrors.ts';
import { GetPermissions } from './widgets/auth/GetPermissions.ts';
import NavMenu from './ui/navigation/NavMenu.tsx';
import NavLink from './ui/navigation/NavLink.tsx';
import { UserPermissions } from './domain/user/IPermissions.ts';
import { LoadUser } from './widgets/auth/LoadUser.ts';
import { LoadTodoList } from './widgets/todo/operations/LoadTodoList.ts';

function App() {
  const loadUser = useCommand(LoadUser);
  const loadTodoList = useCommand(LoadTodoList);
  const errors = useQuery(GetErrors, undefined, undefined);
  const permissions = useQuery(GetPermissions, undefined, new UserPermissions({}));

  useAsyncEffect(async () => {
    await loadUser(undefined);
    await loadTodoList(undefined);
  }, [loadUser, loadTodoList]);

  return (
    <div>
      {errors && <div>{errors.message}</div>}
      <h1>App</h1>
      <NavMenu>
        <NavLink to="/">Home</NavLink>
        {permissions.hasRight('todo', 'write') && <NavLink to="/add-todo">Create Todo</NavLink>}
      </NavMenu>
      <Outlet />
    </div>
  );
}

export default App;
