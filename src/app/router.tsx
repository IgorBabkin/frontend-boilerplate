import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import CreateTodoPage from './pages/CreateTodoPage.tsx';
import App from './App.tsx';

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
