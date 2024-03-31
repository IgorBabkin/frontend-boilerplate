import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import { Scope } from './scope/Scope.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Scope tags="page,home">
        <HomePage />
      </Scope>
    ),
  },
]);
