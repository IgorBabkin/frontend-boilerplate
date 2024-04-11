import './App.scss';
import { Outlet } from 'react-router-dom';
import NavMenu from '@ui/navigation/NavMenu.tsx';
import NavLink from '@ui/navigation/NavLink.tsx';
import NotificationsWidget from './widgets/notifications/NotificationsWidget.tsx';

function App() {
  return (
    <div>
      <NotificationsWidget />
      <h1>App</h1>
      <NavMenu>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/add-todo">Create Todo</NavLink>
      </NavMenu>
      <Outlet />
    </div>
  );
}

export default App;
