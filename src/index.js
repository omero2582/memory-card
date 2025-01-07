import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LogProvider } from './context/LogContext';

import { store } from './store/store.js'
import { Provider as ReduxProvider } from 'react-redux'
import { MyQueryProvider } from './context/MyQueryProvider.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ReduxProvider store={store}> 
    <MyQueryProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MyQueryProvider>
  </ReduxProvider>
  // </React.StrictMode>
);

