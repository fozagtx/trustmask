import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useSmartAccountContext } from '@/contexts/SmartAccountContext';

// Multicall3 contract (deployed on most EVM chains)
const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11' as const;

// Use full ABI object format instead of parseAbi for complex tuple types
const multicall3Abi = [
  {
    type: 'function',
    name: 'aggregate3',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'calls',
        type: 'tuple[]',
        components: [
          { name: 'target', type: 'address' },
          { name: 'allowFailure', type: 'bool' },
          { name: 'callData', type: 'bytes' },
        ],
      },
    ],
    outputs: [
      {
        name: 'returnData',
        type: 'tuple[]',
        components: [
          { name: 'success', type: 'bool' },
          { name: 'returnData', type: 'bytes' },
        ],
      },
    ],
  },
] as const;

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

interface RevokeItem {
  tokenAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
}

export function useBatchRevoke() {
  const { address } = useAccount();
  const { sendTransaction, data: hash, isPending: isEOAPending, error, reset } = useSendTransaction();
  const { smartAccount, bundlerClient, isSmartAccountReady } = useSmartAccountContext();

  const [itemCount, setItemCount] = useState(0);
  const [isSmartAccountPending, setIsSmartAccountPending] = useState(false);
  const [isSmartAccountConfirming, setIsSmartAccountConfirming] = useState(false);
  const [smartAccountSuccess, setSmartAccountSuccess] = useState(false);

  const { isLoading: isConfirming, isSuccess: isEOASuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const isPending = isSmartAccountReady ? isSmartAccountPending : isEOAPending;
  const isSuccess = isSmartAccountReady ? smartAccountSuccess : isEOASuccess;

  useEffect(() => {
    if (isEOASuccess && hash && !isSmartAccountReady) {
      toast.success(`Successfully revoked ${itemCount} permission${itemCount > 1 ? 's' : ''}!`);
      reset();
    }
  }, [isEOASuccess, hash, itemCount, reset, isSmartAccountReady]);

  useEffect(() => {
    if (error) {
      toast.error('Batch revoke failed');
      reset();
    }
  }, [error, reset]);

  const batchRevoke = async (items: RevokeItem[]) => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    if (items.length === 0) {
      toast.error('No permissions selected');
      return;
    }

    setItemCount(items.length);

    // Use Smart Account if ready - native batch support without multicall!
    if (isSmartAccountReady && smartAccount && bundlerClient) {
      setIsSmartAccountPending(true);
      setSmartAccountSuccess(false);

      try {
        toast.info(`Submitting batch revoke of ${items.length} permission${items.length > 1 ? 's' : ''} via Smart Account...`);

        // Build calls for smart account - no need for multicall wrapper!
        const calls = items.map((item) => ({
          to: item.tokenAddress,
          data: encodeFunctionData({
            abi: erc20ApproveAbi,
            functionName: 'approve',
            args: [item.spenderAddress, 0n],
          }),
          value: 0n,
        }));

        // Get gas prices
        const gasPrice = await bundlerClient.request({
          method: 'pimlico_getUserOperationGasPrice' as any,
        }).catch(() => null);

        // Send user operation with all calls batched natively
        const userOpHash = await bundlerClient.sendUserOperation({
          account: smartAccount,
          calls,
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
          toast.success(`Successfully revoked ${items.length} permission${items.length > 1 ? 's' : ''} via Smart Account!`);
        } else {
          toast.error('Batch user operation failed');
        }
      } catch (err) {
        console.error('Smart account batch revoke failed:', err);
        setIsSmartAccountPending(false);
        setIsSmartAccountConfirming(false);
        toast.error('Failed to batch revoke via Smart Account');
      }
      return;
    }

    // Fallback to EOA with Multicall3
    try {
      // Build multicall data for all revokes
      const calls = items.map((item) => ({
        target: item.tokenAddress,
        allowFailure: false,
        callData: encodeFunctionData({
          abi: erc20ApproveAbi,
          functionName: 'approve',
          args: [item.spenderAddress, 0n],
        }),
      }));

      // Encode the aggregate3 call
      const data = encodeFunctionData({
        abi: multicall3Abi,
        functionName: 'aggregate3',
        args: [calls],
      });

      sendTransaction({
        to: MULTICALL3_ADDRESS,
        data,
      });

      toast.info(`Confirm batch revoke of ${items.length} permission${items.length > 1 ? 's' : ''} in your wallet...`);
    } catch (err) {
      console.error('Batch revoke failed:', err);
      toast.error('Failed to prepare batch revoke');
    }
  };

  return {
    batchRevoke,
    isPending,
    isConfirming: isSmartAccountReady ? isSmartAccountConfirming : isConfirming,
    isSuccess,
    hash,
  };
}
