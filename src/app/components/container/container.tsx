import { Suspense, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useWallet } from '@app/common/hooks/use-wallet';
import { useAuthRequest } from '@app/store/onboarding/onboarding.hooks';
import { useOnCancel, useTransactionRequestState } from '@app/store/transactions/requests.hooks';
import { useRouteHeaderState } from '@app/store/ui/ui.hooks';

import { ContainerLayout } from './container.layout';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { AccountInfoFetcher, BalanceFetcher } from '@app/pages/home/components/fetchers';

function UnmountEffectSuspense() {
  const transactionRequest = useTransactionRequestState();
  const { authRequest } = useAuthRequest();
  const handleCancelTransaction = useOnCancel();
  const { cancelAuthentication } = useWallet();

  /*
   * When the popup is closed, this checks the request type and forces
   * the request promise to fail; triggering an onCancel callback function.
   */
  const handleUnmount = useCallback(async () => {
    if (!!transactionRequest) {
      await handleCancelTransaction();
    } else if (!!authRequest) {
      cancelAuthentication();
    }
  }, [transactionRequest, authRequest, handleCancelTransaction, cancelAuthentication]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnmount);
    return () => window.removeEventListener('beforeunload', handleUnmount);
  }, [handleUnmount]);

  return null;
}

function UnmountEffect() {
  return (
    <Suspense fallback={<></>}>
      <UnmountEffectSuspense />
    </Suspense>
  );
}

export function Container(): JSX.Element | null {
  const [routeHeader, _] = useRouteHeaderState();
  const account = useCurrentAccount();

  return (
    <ContainerLayout header={routeHeader}>
      <Suspense fallback={null}>
        {account?.address && <BalanceFetcher address={account.address} />}
        {account?.address && <AccountInfoFetcher address={account.address} />}
      </Suspense>
      <UnmountEffect />
      <Outlet />
    </ContainerLayout>
  );
}
