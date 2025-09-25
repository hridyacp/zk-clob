// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi.ts';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* The WalletProvider has been moved into App.tsx */}
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);