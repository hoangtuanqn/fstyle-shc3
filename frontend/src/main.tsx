import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import { store } from '~/store/store';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a0703',
              border: '1px solid rgba(254,230,34,.18)',
              color: '#f2ede0',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 13,
            },
            classNames: {
              success: 'toast-success',
              error: 'toast-error',
            },
          }}
        />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
