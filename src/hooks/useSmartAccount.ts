import { useState, useCallback } from 'react';
import { type Hex, encodeFunctionData } from 'viem';
import { useSmartAccountContext } from '@/contexts/SmartAccountContext';
import { toast } from 'sonner';

interface Call {
  to: `0x${string}`;
  data?: Hex;
  value?: bigint;
}

interface SendUserOperationResult {
  userOpHash: Hex;
}

export function useSmartAccount() {
  const {
    smartAccount,
    bundlerClient,
    smartAccountAddress,
    isSmartAccountEnabled,
    isSmartAccountSupported,
    isSmartAccountReady,
    isInitializing,
    error,
    enableSmartAccount,
    disableSmartAccount,
  } = useSmartAccountContext();

  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const sendUserOperation = useCallback(
    async (calls: Call[]): Promise<SendUserOperationResult | null> => {
      if (!isSmartAccountReady || !bundlerClient || !smartAccount) {
        toast.error('Smart account is not ready');
        return null;
      }

      setIsPending(true);

      try {
        // Get gas prices from bundler
        const gasPrice = await bundlerClient.request({
          method: 'pimlico_getUserOperationGasPrice' as any,
        }).catch(() => null);

        // Send the user operation
        const userOpHash = await bundlerClient.sendUserOperation({
          account: smartAccount,
          calls: calls.map((call) => ({
            to: call.to,
            data: call.data ?? '0x',
            value: call.value ?? 0n,
          })),
          ...(gasPrice
            ? {
                maxFeePerGas: BigInt((gasPrice as any).standard?.maxFeePerGas ?? 1n),
                maxPriorityFeePerGas: BigInt((gasPrice as any).standard?.maxPriorityFeePerGas ?? 1n),
              }
            : {}),
        });

        setIsPending(false);
        setIsConfirming(true);

        toast.info('User operation submitted, waiting for confirmation...');

        // Wait for the user operation to be included
        const receipt = await bundlerClient.waitForUserOperationReceipt({
          hash: userOpHash,
        });

        setIsConfirming(false);

        if (receipt.success) {
          toast.success('Transaction confirmed via Smart Account!');
        } else {
          toast.error('User operation failed');
        }

        return { userOpHash };
      } catch (err) {
        console.error('Failed to send user operation:', err);
        setIsPending(false);
        setIsConfirming(false);
        toast.error('Failed to send user operation');
        return null;
      }
    },
    [isSmartAccountReady, bundlerClient, smartAccount]
  );

  const sendBatchUserOperation = useCallback(
    async (calls: Call[]): Promise<SendUserOperationResult | null> => {
      // Batch operations are handled the same way in ERC-4337
      return sendUserOperation(calls);
    },
    [sendUserOperation]
  );

  return {
    // State
    smartAccount,
    smartAccountAddress,
    isSmartAccountEnabled,
    isSmartAccountSupported,
    isSmartAccountReady,
    isInitializing,
    error,
    isPending,
    isConfirming,

    // Actions
    enableSmartAccount,
    disableSmartAccount,
    sendUserOperation,
    sendBatchUserOperation,
  };
}
