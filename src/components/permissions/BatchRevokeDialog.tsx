import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertTriangle, Fuel, Trash2 } from 'lucide-react';
import { type Permission } from '@/lib/mockData';
import { useEstimateGas, useGasPrice } from 'wagmi';
import { encodeFunctionData, parseAbi, formatGwei, formatEther } from 'viem';

const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11' as const;

const multicall3Abi = parseAbi([
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[])',
]);

const erc20ApproveAbi = parseAbi([
  'function approve(address spender, uint256 value) returns (bool)',
]);

interface BatchRevokeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: Permission[];
  onConfirm: () => void;
  isRevoking: boolean;
}

export function BatchRevokeDialog({
  open,
  onOpenChange,
  permissions,
  onConfirm,
  isRevoking,
}: BatchRevokeDialogProps) {
  const [estimatedCost, setEstimatedCost] = useState<string | null>(null);

  // Build multicall data for gas estimation
  const calls = permissions.map(p => ({
    target: p.token as `0x${string}`,
    allowFailure: false,
    callData: encodeFunctionData({
      abi: erc20ApproveAbi,
      functionName: 'approve',
      args: [p.spender as `0x${string}`, 0n],
    }),
  }));

  const multicallData = permissions.length > 0 ? encodeFunctionData({
    abi: multicall3Abi,
    functionName: 'aggregate3',
    args: [calls],
  }) : undefined;

  const { data: gasEstimate, isLoading: isEstimatingGas } = useEstimateGas({
    to: MULTICALL3_ADDRESS,
    data: multicallData,
    query: {
      enabled: open && permissions.length > 0,
    },
  });

  const { data: gasPrice } = useGasPrice({
    query: {
      enabled: open && permissions.length > 0,
    },
  });

  useEffect(() => {
    if (gasEstimate && gasPrice) {
      const totalCost = gasEstimate * gasPrice;
      setEstimatedCost(formatEther(totalCost));
    } else if (permissions.length > 0) {
      // Fallback estimation: ~50k gas per approval + 21k base
      const estimatedGas = BigInt(21000 + permissions.length * 50000);
      const fallbackGasPrice = BigInt(30000000000); // 30 gwei fallback
      const totalCost = estimatedGas * (gasPrice || fallbackGasPrice);
      setEstimatedCost(formatEther(totalCost));
    }
  }, [gasEstimate, gasPrice, permissions.length]);

  const totalValueAtRisk = permissions.reduce((sum, p) => sum + p.amountUSD, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Confirm Batch Revoke
          </DialogTitle>
          <DialogDescription>
            You are about to revoke {permissions.length} permission{permissions.length > 1 ? 's' : ''} in a single transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Gas Estimate Card */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Fuel className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Estimated Gas Cost</p>
                <p className="text-xs text-muted-foreground">
                  {gasEstimate ? `${gasEstimate.toLocaleString()} gas units` : 'Calculating...'}
                </p>
              </div>
            </div>
            <div className="text-right">
              {isEstimatingGas ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className="font-mono font-medium">
                    {estimatedCost ? `~${parseFloat(estimatedCost).toFixed(6)} ETH` : '---'}
                  </p>
                  {gasPrice && (
                    <p className="text-xs text-muted-foreground">
                      @ {formatGwei(gasPrice)} gwei
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Value Summary */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm font-medium">Total Value Being Protected</p>
            <p className="font-mono font-bold text-success">
              ${totalValueAtRisk.toLocaleString()}
            </p>
          </div>

          {/* Permissions List */}
          <div>
            <p className="text-sm font-medium mb-2">Permissions to Revoke:</p>
            <ScrollArea className="h-[200px] rounded-lg border border-border">
              <div className="p-2 space-y-2">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-xs font-bold">{permission.tokenSymbol[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{permission.tokenSymbol}</p>
                        <p className="text-xs text-muted-foreground">{permission.spenderName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono">{permission.amount}</p>
                      <Badge variant="secondary" className="text-xs">
                        {permission.chain}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRevoking}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isRevoking}
            className="gap-2"
          >
            {isRevoking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Revoking...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Revoke {permissions.length} Permission{permissions.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
