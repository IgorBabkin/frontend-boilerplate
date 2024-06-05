import NavMenu from '@ui/navigation/NavMenu';
import NavLink from '@ui/navigation/NavLink';

export const NavigationWidget = () => {
  return (
    <NavMenu>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/add-todo">Create Todo</NavLink>
    </NavMenu>
  );
};

export default NavigationWidget;
