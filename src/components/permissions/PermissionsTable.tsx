import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Trash2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { type Permission } from '@/lib/mockData';
import { useState } from 'react';

interface PermissionsTableProps {
  permissions: Permission[];
}

export function PermissionsTable({ permissions }: PermissionsTableProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === permissions.length) {
      setSelected([]);
    } else {
      setSelected(permissions.map(p => p.id));
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getRiskBg = (score: number) => {
    if (score >= 80) return 'bg-success/20';
    if (score >= 50) return 'bg-warning/20';
    return 'bg-destructive/20';
  };

  const getStatusBadge = (status: Permission['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="status-badge status-active"><CheckCircle className="w-3 h-3" />Active</Badge>;
      case 'warning':
        return <Badge className="status-badge status-warning"><AlertTriangle className="w-3 h-3" />Warning</Badge>;
      case 'revoked':
        return <Badge className="status-badge status-revoked"><XCircle className="w-3 h-3" />Revoked</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">All Permissions</h2>
            <p className="text-sm text-muted-foreground">
              {permissions.length} permissions found
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <Button variant="destructive" size="sm" className="gap-1.5">
                <Trash2 className="w-4 h-4" />
                Revoke {selected.length} Selected
              </Button>
            )}
            <Button variant="outline" size="sm">
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12">
                <Checkbox 
                  checked={selected.length === permissions.length}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th>Token</th>
              <th>Spender</th>
              <th>Amount</th>
              <th>USD Value</th>
              <th>Chain</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Age</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission, index) => (
              <motion.tr
                key={permission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  selected.includes(permission.id) && "bg-primary/5"
                )}
              >
                <td>
                  <Checkbox 
                    checked={selected.includes(permission.id)}
                    onCheckedChange={() => toggleSelect(permission.id)}
                  />
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-xs font-bold">{permission.tokenSymbol[0]}</span>
                    </div>
                    <span className="font-medium">{permission.tokenSymbol}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <p className="font-medium">{permission.spenderName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{permission.spender}</p>
                  </div>
                </td>
                <td className="font-mono">{permission.amount}</td>
                <td className="font-mono">${permission.amountUSD.toLocaleString()}</td>
                <td>
                  <Badge variant="secondary">{permission.chain}</Badge>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      getRiskBg(permission.riskScore),
                      getRiskColor(permission.riskScore)
                    )}>
                      {permission.riskScore}
                    </div>
                  </div>
                </td>
                <td>{getStatusBadge(permission.status)}</td>
                <td className="text-muted-foreground text-sm">
                  {formatDistanceToNow(permission.timestamp, { addSuffix: true })}
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    {permission.status !== 'revoked' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
