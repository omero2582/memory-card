import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LogProvider } from './context/LogContext';
import GameProvider from './context/GameContext';

import { store } from './store/store.js'
import { Provider as ReduxProvider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ReduxProvider store={store}> 
      <ThemeProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </ThemeProvider>
  </ReduxProvider>
  // </React.StrictMode>
);

