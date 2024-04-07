import './App.css';
import { Outlet } from 'react-router-dom';
import { useAsyncEffect, useController } from '../lib/scope/useQuery.ts';
import NavMenu from './ui/navigation/NavMenu.tsx';
import NavLink from './ui/navigation/NavLink.tsx';
import { UserPermissions } from './domain/user/IPermissions.ts';
import ErrorsWidget from './widgets/errors/ErrorsWidget.tsx';
import { IUserControllerKey, UserController } from './widgets/auth/UserController.ts';
import { useObservable } from '../lib/observable/observable.ts';
import { useMemo } from 'react';

function App() {
  const userController = useController<UserController>(IUserControllerKey);
  const permissions = useObservable(
    useMemo(() => userController.getPermissions$(), [userController]),
    UserPermissions.default,
  );

  useAsyncEffect(async () => {
    await userController.loadUser();
  }, [userController]);

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
