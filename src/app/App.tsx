import './App.css';
import { Outlet } from 'react-router-dom';
import { useQuery } from '../lib/scope/useQuery.ts';
import { GetErrors } from './widgets/errors/GetErrors.ts';
import { GetPermissions } from './widgets/auth/GetPermissions.ts';
import { hasPermission } from './domain/auth/IPermissions.ts';
import NavMenu from './ui/navigation/NavMenu.tsx';
import NavLink from './ui/navigation/NavLink.tsx';

function App() {
  const errors = useQuery(GetErrors, undefined, undefined);
  const permissions = useQuery(GetPermissions, undefined, {});

  return (
    <div>
      {errors && <div>{errors.message}</div>}
      <h1>App</h1>
      <NavMenu>
        <NavLink to="/">Home</NavLink>
        {hasPermission(permissions, 'todo', 'write') && <NavLink to="/add-todo">Create Todo</NavLink>}
      </NavMenu>
      <Outlet />
    </div>
  );
}

export default App;
