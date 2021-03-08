import {
  Methods,
  MessageFromApp,
  SetPassword,
  StoreSeed,
  UnlockWallet,
  SwitchAccount,
} from '@extension/message-types';
import type { Vault } from '@extension/background/vault-manager';
import { RecoilState, useRecoilCallback } from 'recoil';
import {
  hasSetPasswordStore,
  walletStore,
  secretKeyStore,
  currentAccountIndexStore,
  encryptedSecretKeyStore,
  hasRehydratedVaultStore,
} from '@store/recoil/wallet';

type Set = <T>(store: RecoilState<T>, value: T) => void;

const innerMessageWrapper = async (message: MessageFromApp, set: Set) => {
  return new Promise<Vault>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (vaultOrError: Vault | Error) => {
      if ('hasSetPassword' in vaultOrError) {
        const vault = vaultOrError;
        set(hasRehydratedVaultStore, true);
        set(hasSetPasswordStore, vault.hasSetPassword);
        set(walletStore, vault.wallet);
        set(secretKeyStore, vault.secretKey);
        set(currentAccountIndexStore, vault.currentAccountIndex);
        set(encryptedSecretKeyStore, vault.encryptedSecretKey);
        resolve(vault);
      } else {
        reject(vaultOrError);
      }
    });
  });
};

const messageWrapper = (message: MessageFromApp) => {
  return useRecoilCallback(({ set }) => () => innerMessageWrapper(message, set), [
    message,
    innerMessageWrapper,
  ]);
};

export const useVaultMessenger = () => {
  const doSetPassword = useRecoilCallback(({ set }) => (password: string) => {
    const message: SetPassword = {
      method: Methods.setPassword,
      payload: password,
    };
    return innerMessageWrapper(message, set);
  });

  const doStoreSeed = useRecoilCallback(({ set }) => (secretKey: string, password?: string) => {
    const message: StoreSeed = {
      method: Methods.storeSeed,
      payload: {
        secretKey,
        password,
      },
    };
    return innerMessageWrapper(message, set);
  });

  const doUnlockWallet = useRecoilCallback(({ set }) => (password: string) => {
    const message: UnlockWallet = {
      method: Methods.unlockWallet,
      payload: password,
    };
    return innerMessageWrapper(message, set);
  });

  const doSwitchAccount = useRecoilCallback(({ set }) => (index: number) => {
    const message: SwitchAccount = {
      method: Methods.switchAccount,
      payload: index,
    };
    return innerMessageWrapper(message, set);
  });

  const getWallet = messageWrapper({ method: Methods.walletRequest, payload: undefined });
  const doMakeWallet = messageWrapper({ method: Methods.makeWallet, payload: undefined });
  const doCreateNewAccount = messageWrapper({
    method: Methods.createNewAccount,
    payload: undefined,
  });
  const doSignOut = messageWrapper({ method: Methods.signOut, payload: undefined });
  const doLockWallet = messageWrapper({ method: Methods.lockWallet, payload: undefined });

  return {
    getWallet,
    doMakeWallet,
    doCreateNewAccount,
    doSignOut,
    doLockWallet,
    doSetPassword,
    doStoreSeed,
    doUnlockWallet,
    doSwitchAccount,
  };
};