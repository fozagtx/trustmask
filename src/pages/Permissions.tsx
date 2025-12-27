import { PermissionsTable } from '@/components/permissions/PermissionsTable';
import { useApprovalEvents } from '@/hooks/useApprovalEvents';
import { mockPermissions } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, RefreshCw, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export default function PermissionsPage() {
  const { isConnected, address } = useAccount();
  const { data, isLoading, refetch, isFetching } = useApprovalEvents();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [chainFilter, setChainFilter] = useState('all-chains');
  const [statusFilter, setStatusFilter] = useState('all-status');

  // Use real data if available, otherwise fallback to mock
  const rawPermissions = data?.permissions?.length ? data.permissions : mockPermissions;
  
  // Apply filters
  const permissions = rawPermissions.filter(p => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        p.tokenSymbol.toLowerCase().includes(query) ||
        p.spenderName.toLowerCase().includes(query) ||
        p.spender.toLowerCase().includes(query) ||
        p.token.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    
    // Chain filter
    if (chainFilter !== 'all-chains') {
      if (p.chain.toLowerCase() !== chainFilter) return false;
    }
    
    // Status filter
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
            {isLoading ? 'Fetching on-chain approvals...' : `${permissions.length} token approvals found`}
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

      <PermissionsTable permissions={permissions} />
    </div>
  );
}
