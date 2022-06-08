// This is a wrapper component to provide default/mock data to various atoms
import React, { StrictMode, Suspense } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'jotai';
import { softwareWalletState } from '@app/store/wallet/wallet';
import { TEST_WALLET, HEYSTACK_HEY_TX_REQUEST, STX_TRANSFER_TX_REQUEST } from './mocks';
import { requestTokenState } from '@app/store/transactions/requests';
import { selectedAssetIdState } from '@app/store/assets/asset-search';

import { QueryClient, QueryClientProvider } from 'react-query';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const testQueryClient = createTestQueryClient();

export const ProviderWithWalletAndRequestToken: React.FC = ({ children }) => (
  <Router>
    <QueryClientProvider client={testQueryClient}>
      <Provider
        initialValues={[
          [softwareWalletState, TEST_WALLET] as const,
          [requestTokenState, HEYSTACK_HEY_TX_REQUEST] as const,
          [
            selectedAssetIdState,
            'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N.hey-token::hey-token',
          ] as const,
        ]}
      >
        {children}
      </Provider>
    </QueryClientProvider>
  </Router>
);

export const ProviderWithWalletAndStxTransferRequestToken: React.FC = ({ children }) => (
  <Router>
    <QueryClientProvider client={testQueryClient}>
      <Provider
        initialValues={[
          [softwareWalletState, TEST_WALLET] as const,
          [requestTokenState, STX_TRANSFER_TX_REQUEST] as const,
        ]}
      >
        {children}
      </Provider>
    </QueryClientProvider>
  </Router>
);

// This is a wrapper component to provide default/mock data to various atoms
export const ProviderWithTestWallet: React.FC = ({ children }) => (
  <StrictMode>
    <Suspense fallback="loading">
      <Provider initialValues={[[softwareWalletState, TEST_WALLET] as const]}>{children}</Provider>
    </Suspense>
  </StrictMode>
);
