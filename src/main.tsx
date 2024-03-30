import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Scope } from './Scope.tsx';
import { Container, MetadataInjector } from 'ts-ioc-container';
import { Common } from './env/Common.ts';

const el = document.getElementById('root')!;
const createContainer = (tags: string[]) => new Container(new MetadataInjector(), { tags }).use(new Common());

ReactDOM.createRoot(el).render(
  <React.StrictMode>
    <Scope fallback={createContainer} tags="application">
      <App />
    </Scope>
  </React.StrictMode>,
);
