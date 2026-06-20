import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import { store } from '~/store/store';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-bg2 gold-border text-text font-montserrat text-[13px]',
          classNames: {
            success: 'toast-success',
            error: 'toast-error',
          },
        }}
      />
    </Provider>
  </StrictMode>,
);
