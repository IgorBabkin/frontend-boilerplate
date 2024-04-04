import 'reflect-metadata';
import ReactDOM from 'react-dom/client';
import './main.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router.tsx';

const el = document.getElementById('root')!;

ReactDOM.createRoot(el).render(<RouterProvider router={router} />);
