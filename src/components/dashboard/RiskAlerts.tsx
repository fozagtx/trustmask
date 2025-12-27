import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Permission } from '@/lib/mockData';
import { useRevokeApproval } from '@/hooks/useRevokeApproval';
import { useState } from 'react';

interface RiskAlertsProps {
  permissions: Permission[];
}

export function RiskAlerts({ permissions }: RiskAlertsProps) {
  const { revoke, isPending, isConfirming } = useRevokeApproval();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // Generate alerts from real permissions
  const alerts = permissions
    .filter(p => p.status !== 'revoked')
    .map(p => {
      if (p.amount === 'Unlimited' && p.amountUSD > 10000) {
        return { id: p.id, type: 'high-value', icon: AlertTriangle, title: 'High Value Permission', description: `${p.spenderName} has unlimited ${p.tokenSymbol} approval`, severity: 'warning', permission: p };
      }
      if (p.spenderName === 'Unknown Contract') {
        return { id: p.id, type: 'unverified', icon: AlertCircle, title: 'Unverified Contract', description: `Unknown contract with ${p.tokenSymbol} access`, severity: 'destructive', permission: p };
      }
      if (Date.now() - p.timestamp > 30 * 24 * 60 * 60 * 1000) {
        return { id: p.id, type: 'old', icon: Clock, title: 'Old Permission', description: `${p.spenderName} permission older than 30 days`, severity: 'muted', permission: p };
      }
      return null;
    })
    .filter(Boolean)
    .slice(0, 3);

  const handleRevoke = async (permission: Permission) => {
    setRevokingId(permission.id);
    await revoke(permission.token as `0x${string}`, permission.spender as `0x${string}`);
    setRevokingId(null);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'destructive': return 'border-destructive/30 bg-destructive/5';
      case 'warning': return 'border-warning/30 bg-warning/5';
      default: return 'border-border bg-secondary/30';
    }
  };

  const getIconStyles = (severity: string) => {
    switch (severity) {
      case 'destructive': return 'text-destructive bg-destructive/10';
      case 'warning': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-secondary';
    }
  };

  if (alerts.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-2">Risk Alerts</h2>
        <p className="text-sm text-muted-foreground">No alerts - your permissions look safe!</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Risk Alerts</h2>
          <p className="text-sm text-muted-foreground">Permissions requiring attention</p>
        </div>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const AlertIcon = alert!.icon;
          return (
            <motion.div key={alert!.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.1 }} className={cn("flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 hover:bg-secondary/20", getSeverityStyles(alert!.severity))}>
              <div className={cn("p-2 rounded-lg shrink-0", getIconStyles(alert!.severity))}>
                <AlertIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium">{alert!.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{alert!.description}</p>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRevoke(alert!.permission)} disabled={revokingId === alert!.id && (isPending || isConfirming)}>
                {revokingId === alert!.id && (isPending || isConfirming) ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Revoke
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
