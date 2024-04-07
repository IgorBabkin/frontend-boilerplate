import './App.css';
import { Outlet } from 'react-router-dom';
import NavMenu from './ui/navigation/NavMenu.tsx';
import NavLink from './ui/navigation/NavLink.tsx';
import { UserPermissions } from './domain/user/IPermissions.ts';
import ErrorsWidget from './widgets/errors/ErrorsWidget.tsx';
import { IUserServiceKey, UserService } from './widgets/auth/UserService.ts';
import { useObservable } from '../lib/observable/observable.ts';
import { useMemo } from 'react';
import { useDependency } from '../lib/scope/ScopeContext.ts';

function App() {
  const userService = useDependency<UserService>(IUserServiceKey);
  const permissions = useObservable(
    useMemo(() => userService.getPermissions$(), [userService]),
    UserPermissions.default,
  );

  return (
    <div>
      <ErrorsWidget />
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
