import { PropsWithChildren } from 'react';
import { NavLink as ReactNavLink } from 'react-router-dom';

function NavLink({ children, to }: PropsWithChildren<{ to: string }>) {
  return (
    <li className="nav__item">
      <ReactNavLink to={to}>{children}</ReactNavLink>
    </li>
  );
}

export default NavLink;
