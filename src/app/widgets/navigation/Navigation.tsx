import NavMenu from '@ui/navigation/NavMenu.tsx';
import NavLink from '@ui/navigation/NavLink.tsx';

export const Navigation = () => {
  return (
    <NavMenu>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/add-todo">Create Todo</NavLink>
    </NavMenu>
  );
};

export default Navigation;
