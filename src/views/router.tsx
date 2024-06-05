import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import CreateTodoPage from '@pages/CreateTodoPage';
import App from './App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/add-todo',
        element: <CreateTodoPage />,
      },
    ],
  },
]);
