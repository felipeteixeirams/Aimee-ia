import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.js';
import './index.css';
import { validateConfig } from '../lib/config.js';
import { testConnection } from '../lib/firebase.js';
import { logger } from '../lib/logger.js';

// Centralized configuration validation
validateConfig();

// Test Firebase connection
testConnection().then(res => {
  if (!res.ok) {
    logger.error('Startup - Firebase connection test failed', { error: res.error });
  }
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}

import { ToastProvider } from './components/ToastProvider.js';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <ToastProvider>
        <App />
      </ToastProvider>
    </GlobalErrorBoundary>
  </StrictMode>
);
