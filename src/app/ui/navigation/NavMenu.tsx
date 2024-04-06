import { PropsWithChildren } from 'react';
import './NavMenu.css';

function NavMenu({ children }: PropsWithChildren) {
  return (
    <nav>
      <ul className="nav__menu">{children}</ul>
    </nav>
  );
}

export default NavMenu;
