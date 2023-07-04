import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Sandbox from './Sandbox'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <Sandbox/> */}
  </React.StrictMode>
);

