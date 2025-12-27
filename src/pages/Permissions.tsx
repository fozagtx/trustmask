import { PermissionsTable } from '@/components/permissions/PermissionsTable';
import { useApprovalEvents } from '@/hooks/useApprovalEvents';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, RefreshCw, Loader2, Shield } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccount, useChainId } from 'wagmi';
import { useState } from 'react';

function getChainDisplayName(chainId: number): string {
  switch (chainId) {
    case 1: return 'Ethereum Mainnet';
    case 11155111: return 'Sepolia Testnet';
    case 41454: return 'Monad Testnet';
    default: return 'Unknown Chain';
  }
}

export default function PermissionsPage() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { data, isLoading, refetch, isFetching } = useApprovalEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [chainFilter, setChainFilter] = useState('all-chains');
  const [statusFilter, setStatusFilter] = useState('all-status');

  const rawPermissions = data?.permissions || [];
  
  // Apply filters
  const permissions = rawPermissions.filter(p => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        p.tokenSymbol.toLowerCase().includes(query) ||
        p.spenderName.toLowerCase().includes(query) ||
        p.spender.toLowerCase().includes(query) ||
        p.token.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    
    if (chainFilter !== 'all-chains') {
      if (p.chain.toLowerCase() !== chainFilter) return false;
    }
    
    if (statusFilter !== 'all-status') {
      if (p.status !== statusFilter) return false;
    }
    
    return true;
  });

  const handleRefresh = () => {
    if (isConnected && address) {
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Permissions</h1>
          <p className="text-muted-foreground">
            {isLoading 
              ? 'Scanning blockchain for approvals...' 
              : `${permissions.length} active approvals on ${getChainDisplayName(chainId)}`
            }
          </p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleRefresh}
          disabled={isFetching}
        >
          {isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by token, spender, or address..."
              className="pl-10 bg-secondary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={chainFilter} onValueChange={setChainFilter}>
              <SelectTrigger className="w-[140px] bg-secondary/50">
                <SelectValue placeholder="Chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-chains">All Chains</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="monad">Monad</SelectItem>
                <SelectItem value="sepolia">Sepolia</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-secondary/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {!isLoading && permissions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-success/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Active Approvals</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your wallet has no active token approvals on {getChainDisplayName(chainId)}. 
            When you approve tokens for DeFi protocols, they'll appear here.
          </p>
        </motion.div>
      ) : (
        <PermissionsTable permissions={permissions} />
      )}
    </div>
  );
}
