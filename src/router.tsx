import { createBrowserRouter } from 'react-router-dom';
import HomePage from './app/pages/HomePage.tsx';
import Scope from './lib/scope/Scope.tsx';
import CreateTodoPage from './app/pages/CreateTodoPage.tsx';
import { Container, MetadataInjector } from 'ts-ioc-container';
import { Common } from './env/Common.ts';
import App from './App.tsx';
import { Loader } from './lib/scope/Loader.tsx';

const createContainer = (tags: string[]) => new Container(new MetadataInjector(), { tags }).use(new Common());

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
            <Loader>
              <HomePage />
            </Loader>
          </Scope>
        ),
      },
      {
        path: '/add-todo',
        element: (
          <Scope tags="page">
            <Loader>
              <CreateTodoPage />
            </Loader>
          </Scope>
        ),
      },
    ],
  },
]);
