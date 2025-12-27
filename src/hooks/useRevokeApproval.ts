import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useSmartAccountContext } from '@/contexts/SmartAccountContext';

const erc20ApproveAbi = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const;

export function useRevokeApproval() {
  const { address } = useAccount();
  const { sendTransaction, data: hash, isPending: isEOAPending, error } = useSendTransaction();
  const { smartAccount, bundlerClient, isSmartAccountReady } = useSmartAccountContext();

  const [isSmartAccountPending, setIsSmartAccountPending] = useState(false);
  const [isSmartAccountConfirming, setIsSmartAccountConfirming] = useState(false);
  const [smartAccountSuccess, setSmartAccountSuccess] = useState(false);

  const { isLoading: isConfirming, isSuccess: isEOASuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const isPending = isSmartAccountReady ? isSmartAccountPending : isEOAPending;
  const isSuccess = isSmartAccountReady ? smartAccountSuccess : isEOASuccess;

  // Show success toast when confirmed (EOA path)
  useEffect(() => {
    if (isEOASuccess && hash && !isSmartAccountReady) {
      toast.success('Permission revoked successfully!');
    }
  }, [isEOASuccess, hash, isSmartAccountReady]);

  useEffect(() => {
    if (error) {
      toast.error('Transaction failed');
    }
  }, [error]);

  const revoke = async (tokenAddress: `0x${string}`, spenderAddress: `0x${string}`) => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    const data = encodeFunctionData({
      abi: erc20ApproveAbi,
      functionName: 'approve',
      args: [spenderAddress, 0n],
    });

    // Use Smart Account if ready
    if (isSmartAccountReady && smartAccount && bundlerClient) {
      setIsSmartAccountPending(true);
      setSmartAccountSuccess(false);

      try {
        toast.info('Submitting via Smart Account...');

        // Get gas prices
        const gasPrice = await bundlerClient.request({
          method: 'pimlico_getUserOperationGasPrice' as any,
        }).catch(() => null);

        // Send user operation
        const userOpHash = await bundlerClient.sendUserOperation({
          account: smartAccount,
          calls: [
            {
              to: tokenAddress,
              data,
              value: 0n,
            },
          ],
          ...(gasPrice
            ? {
                maxFeePerGas: BigInt((gasPrice as any).standard?.maxFeePerGas ?? 1n),
                maxPriorityFeePerGas: BigInt((gasPrice as any).standard?.maxPriorityFeePerGas ?? 1n),
              }
            : {}),
        });

        setIsSmartAccountPending(false);
        setIsSmartAccountConfirming(true);

        toast.info('Waiting for confirmation...');

        // Wait for receipt
        const receipt = await bundlerClient.waitForUserOperationReceipt({
          hash: userOpHash,
        });

        setIsSmartAccountConfirming(false);

        if (receipt.success) {
          setSmartAccountSuccess(true);
          toast.success('Permission revoked via Smart Account!');
        } else {
          toast.error('User operation failed');
        }
      } catch (err) {
        console.error('Smart account revoke failed:', err);
        setIsSmartAccountPending(false);
        setIsSmartAccountConfirming(false);
        toast.error('Failed to revoke via Smart Account');
      }
      return;
    }

    // Fallback to EOA transaction
    try {
      sendTransaction({
        to: tokenAddress,
        data,
      });

      toast.info('Confirm the transaction in your wallet...');
    } catch (err) {
      console.error('Revoke failed:', err);
      toast.error('Failed to revoke permission');
    }
  };

  return {
    revoke,
    isPending,
    isConfirming: isSmartAccountReady ? isSmartAccountConfirming : isConfirming,
    isSuccess,
    hash,
  };
}
