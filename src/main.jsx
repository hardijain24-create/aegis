import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Join from './pages/Join.jsx';
import Admin from './pages/Admin.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

const path = window.location.pathname;
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy';

function RootComponent() {
  useEffect(() => {
    // Fire a visit tracking request on load
    const apiUrl = 'https://aegisb.onrender.com';
    fetch(`${apiUrl}/api/visits`, { method: 'POST' }).catch(() => {});
  }, []);

  if (path === '/join') {
    return <Join />;
  }
  if (path === '/AEGIS@12250510') {
    return <Admin />;
  }
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <RootComponent />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
