import { createBrowserRouter } from 'react-router-dom';
import HomePage from './app/pages/HomePage.tsx';
import Scope from './lib/scope/Scope.tsx';

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
