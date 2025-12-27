import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount, useWalletClient, usePublicClient, useChainId } from 'wagmi';
import { type BundlerClient, type SmartAccount } from 'viem/account-abstraction';
import { type MetaMaskSmartAccount, Implementation } from '@metamask/smart-accounts-kit';
import {
  createSmartAccount,
  createSmartAccountBundlerClient,
  isSmartAccountSupported,
} from '@/lib/smartAccount';
import { toast } from 'sonner';

interface SmartAccountContextType {
  // Smart account state
  smartAccount: MetaMaskSmartAccount<Implementation.Hybrid> | null;
  bundlerClient: BundlerClient | null;
  smartAccountAddress: `0x${string}` | null;

  // Feature flags
  isSmartAccountEnabled: boolean;
  isSmartAccountSupported: boolean;
  isSmartAccountReady: boolean;

  // Loading states
  isInitializing: boolean;
  error: Error | null;

  // Actions
  enableSmartAccount: () => Promise<void>;
  disableSmartAccount: () => void;
}

const SmartAccountContext = createContext<SmartAccountContextType | null>(null);

const SMART_ACCOUNT_STORAGE_KEY = 'trustmask-smart-account-enabled';

export function SmartAccountProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const chainId = useChainId();

  const [smartAccount, setSmartAccount] = useState<MetaMaskSmartAccount<Implementation.Hybrid> | null>(null);
  const [bundlerClient, setBundlerClient] = useState<BundlerClient | null>(null);
  const [isSmartAccountEnabled, setIsSmartAccountEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(SMART_ACCOUNT_STORAGE_KEY) === 'true';
  });
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const chainSupportsSmartAccount = useMemo(
    () => isSmartAccountSupported(chainId),
    [chainId]
  );

  const smartAccountAddress = useMemo(
    () => smartAccount?.address ?? null,
    [smartAccount]
  );

  const isSmartAccountReady = useMemo(
    () => !!smartAccount && !!bundlerClient && isSmartAccountEnabled && chainSupportsSmartAccount,
    [smartAccount, bundlerClient, isSmartAccountEnabled, chainSupportsSmartAccount]
  );

  // Initialize smart account when enabled and wallet is connected
  useEffect(() => {
    async function initSmartAccount() {
      if (!isSmartAccountEnabled || !isConnected || !walletClient || !publicClient || !chainSupportsSmartAccount) {
        setSmartAccount(null);
        setBundlerClient(null);
        return;
      }

      setIsInitializing(true);
      setError(null);

      try {
        const chain = publicClient.chain;
        if (!chain) throw new Error('No chain configured');

        // Create the smart account
        const account = await createSmartAccount(walletClient, publicClient, chain);
        setSmartAccount(account);

        // Create the bundler client
        const bundler = createSmartAccountBundlerClient(publicClient, account, chainId);
        setBundlerClient(bundler);

        if (account.address) {
          console.log('Smart account initialized:', account.address);
        }
      } catch (err) {
        console.error('Failed to initialize smart account:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize smart account'));
        toast.error('Failed to initialize smart account');
      } finally {
        setIsInitializing(false);
      }
    }

    initSmartAccount();
  }, [isSmartAccountEnabled, isConnected, walletClient, publicClient, chainId, chainSupportsSmartAccount]);

  const enableSmartAccount = useCallback(async () => {
    if (!chainSupportsSmartAccount) {
      toast.error('Smart accounts are not supported on this network. Please switch to Sepolia.');
      return;
    }

    setIsSmartAccountEnabled(true);
    localStorage.setItem(SMART_ACCOUNT_STORAGE_KEY, 'true');
    toast.success('Smart Account enabled');
  }, [chainSupportsSmartAccount]);

  const disableSmartAccount = useCallback(() => {
    setIsSmartAccountEnabled(false);
    setSmartAccount(null);
    setBundlerClient(null);
    localStorage.setItem(SMART_ACCOUNT_STORAGE_KEY, 'false');
    toast.info('Smart Account disabled');
  }, []);

  const value: SmartAccountContextType = {
    smartAccount,
    bundlerClient,
    smartAccountAddress,
    isSmartAccountEnabled,
    isSmartAccountSupported: chainSupportsSmartAccount,
    isSmartAccountReady,
    isInitializing,
    error,
    enableSmartAccount,
    disableSmartAccount,
  };

  return (
    <SmartAccountContext.Provider value={value}>
      {children}
    </SmartAccountContext.Provider>
  );
}

export function useSmartAccountContext() {
  const context = useContext(SmartAccountContext);
  if (!context) {
    throw new Error('useSmartAccountContext must be used within a SmartAccountProvider');
  }
  return context;
}
