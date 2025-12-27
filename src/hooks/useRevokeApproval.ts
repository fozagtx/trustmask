import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { toast } from 'sonner';
import { useEffect } from 'react';

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
  const { sendTransaction, data: hash, isPending, error } = useSendTransaction();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Show success toast when confirmed
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Permission revoked successfully!');
    }
  }, [isSuccess, hash]);

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

    try {
      const data = encodeFunctionData({
        abi: erc20ApproveAbi,
        functionName: 'approve',
        args: [spenderAddress, 0n],
      });

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
    isConfirming,
    isSuccess,
    hash,
  };
}
