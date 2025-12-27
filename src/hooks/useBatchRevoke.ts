import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { encodeFunctionData, parseAbi } from 'viem';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

// Multicall3 contract (deployed on most EVM chains)
const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11' as const;

const multicall3Abi = parseAbi([
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[])',
]);

const erc20ApproveAbi = parseAbi([
  'function approve(address spender, uint256 value) returns (bool)',
]);

interface RevokeItem {
  tokenAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
}

export function useBatchRevoke() {
  const { address } = useAccount();
  const { sendTransaction, data: hash, isPending, error, reset } = useSendTransaction();
  const [itemCount, setItemCount] = useState(0);
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success(`Successfully revoked ${itemCount} permission${itemCount > 1 ? 's' : ''}!`);
      reset();
    }
  }, [isSuccess, hash, itemCount, reset]);

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

    try {
      // Build multicall data for all revokes
      const calls = items.map(item => ({
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
    isConfirming,
    isSuccess,
    hash,
  };
}
