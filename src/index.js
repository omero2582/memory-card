import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { LogProvider } from './context/LogContext';
import GameProvider from './context/GameContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <LogProvider>
      <ThemeProvider>
        <GameProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </GameProvider>
      </ThemeProvider>
    </LogProvider>
  // </React.StrictMode>
);

