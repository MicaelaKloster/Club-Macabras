import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/AppRouter.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>  
  </React.StrictMode>
);