import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import Scope from '../lib/scope/Scope.tsx';
import CreateTodoPage from './pages/CreateTodoPage.tsx';
import { Container } from 'ts-ioc-container';
import { Common } from '../env/Common.ts';
import App from './App.tsx';
import { DepInjector } from '../lib/scope/DepInjector.ts';

const createContainer = (tags: string[]) => new Container(new DepInjector(), { tags }).use(new Common());

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Scope tags="application" fallback={createContainer}>
        <App />
      </Scope>
    ),
    children: [
      {
        path: '/',
        element: (
          <Scope tags="page">
            <HomePage />
          </Scope>
        ),
      },
      {
        path: '/add-todo',
        element: (
          <Scope tags="page">
            <CreateTodoPage />
          </Scope>
        ),
      },
    ],
  },
]);
