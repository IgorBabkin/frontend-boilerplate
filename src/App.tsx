import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import { useQuery } from './scope/useQuery.tsx';
import { GetConfig } from './GetConfig.ts';

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
