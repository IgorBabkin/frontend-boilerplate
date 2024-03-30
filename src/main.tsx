import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Scope } from './Scope.tsx';
import { Container, MetadataInjector } from 'ts-ioc-container';

const createContainer = (tags: string[]) => new Container(new MetadataInjector(), { tags });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Scope fallback={createContainer} tags="application">
      <App />
    </Scope>
  </React.StrictMode>,
);
