import './App.css';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>App</h1>
      <Link to="/">Home</Link>&nbsp;|&nbsp;
      <Link to="/add-todo">Create Todo</Link>
      <Outlet />
    </div>
  );
}

export default App;
