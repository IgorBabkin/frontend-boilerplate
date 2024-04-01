import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router.tsx';
import { useQuery } from './lib/scope/useQuery.ts';
import { GetConfig } from './app/widgets/config/GetConfig.ts';

function App() {
  const config = useQuery(GetConfig, undefined);
  return (
    <div>
      <h1>App</h1>
      {config && <RouterProvider router={router} />}
    </div>
  );
}

export default App;
