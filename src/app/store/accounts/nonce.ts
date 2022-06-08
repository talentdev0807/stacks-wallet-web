import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import deepEqual from 'fast-deep-equal';

import {
  currentAccountConfirmedTransactionsState,
  currentAccountInfoState,
  currentAccountMempoolTransactionsState,
  currentAccountStxAddressState,
} from '@app/store/accounts';
import { currentNetworkState } from '@app/store/network/networks';
import { makeLocalDataKey } from '@app/common/store-utils';
import { currentAccountLocallySubmittedLatestNonceState } from '@app/store/accounts/account-activity';

export const localNonceState = atomFamily(
  params => atomWithStorage(makeLocalDataKey(['LOCAL_NONCE_STATE', params]), 0),
  deepEqual
);

const currentAccountLocalNonceState = atom(get => {
  const network = get(currentNetworkState);
  const address = get(currentAccountStxAddressState);
  if (!address) return 0;
  return get(localNonceState([address, network.url]));
});

export const lastApiNonceState = atom<{ nonce: number; isMissing?: boolean } | undefined>(
  undefined
);

export const currentAccountNonceState = atom(get => {
  const address = get(currentAccountStxAddressState);
  const account = get(currentAccountInfoState);
  const confirmedTransactions = get(currentAccountConfirmedTransactionsState);
  const pendingTransactions = get(currentAccountMempoolTransactionsState);
  const lastLocalNonce = get(currentAccountLocalNonceState);
  const latestLocallySubmittedNonce = get(currentAccountLocallySubmittedLatestNonceState);
  const lastApiNonce = get(lastApiNonceState);

  if (lastApiNonce && !pendingTransactions) {
    // if there is a missing nonce, use that
    if (lastApiNonce.isMissing) return lastApiNonce.nonce;

    // if we have a locally submitted nonce, and it's higher than the api nonce, use that
    if (
      typeof latestLocallySubmittedNonce === 'number' &&
      latestLocallySubmittedNonce + 1 > lastApiNonce.nonce
    )
      return latestLocallySubmittedNonce + 1;

    // else, use the last api nonce
    return lastApiNonce.nonce;
  }

  // ----
  // TODO: This logic needs to be revisited bc much of it is likely outdated
  // ----

  // most recent confirmed transactions sent by current address
  const lastConfirmedTx = confirmedTransactions?.filter(tx => tx.sender_address === address)?.[0];

  // most recent pending transactions sent by current address
  const latestPendingTx = pendingTransactions?.filter(tx => tx.sender_address === address)?.[0];

  // oldest pending transactions sent by current address
  const oldestPendingTx = pendingTransactions?.length
    ? pendingTransactions?.filter(tx => tx.sender_address === address)?.[
        pendingTransactions?.length - 1
      ]
    : undefined;

  // they have any pending or confirmed transactions
  const hasTransactions = !!latestPendingTx || !!lastConfirmedTx;

  if (!account) return 0;

  // if the oldest pending tx is more than 1 above the account nonce, it's likely there was
  // a race condition such that the client didn't have the most up to date pending tx
  // if this is true, we should rely on the account nonce
  const hasNonceMismatch =
    oldestPendingTx && lastConfirmedTx ? oldestPendingTx.nonce > lastConfirmedTx.nonce + 1 : false;

  // if they do have a miss match, let's use the account nonce
  // or if we don't have any prior transactions, use the info api nonce
  if (hasNonceMismatch || !hasTransactions) return account.nonce;

  // otherwise, without micro-blocks, the account nonce will likely be out of date compared
  // and not be incremented based on pending transactions
  const pendingNonce = latestPendingTx?.nonce || 0;
  const lastConfirmedTxNonce = lastConfirmedTx?.nonce || 0;

  // lastLocalNonce can be set when the user sends transactions
  // and can often be faster that waiting for a new response from the API
  const useLocalNonce = lastLocalNonce > pendingNonce && lastLocalNonce > lastConfirmedTxNonce;

  const usePendingNonce =
    !useLocalNonce &&
    ((lastConfirmedTx && pendingNonce > lastConfirmedTx.nonce) || pendingNonce + 1 > account.nonce);

  // if they have a last confirmed transaction (but no pending)
  // and it's greater than account nonce, we should use that one
  // else we will use the account nonce
  const useLastTxNonce =
    hasTransactions && lastConfirmedTx && lastConfirmedTx.nonce + 1 > account.nonce;
  const lastConfirmedNonce =
    useLastTxNonce && lastConfirmedTx ? lastConfirmedTx.nonce + 1 : account.nonce;

  return useLocalNonce
    ? lastLocalNonce
    : usePendingNonce
    ? // if pending nonce is greater, use that
      pendingNonce + 1
    : // else we use the last confirmed nonce
      lastConfirmedNonce;
});
