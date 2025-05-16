import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { Toaster } from './components/ui/toaster';

// Initialize rendering
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <App Component={() => <div>Vite Development Mode</div>} pageProps={{}} />
        <Toaster />
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
