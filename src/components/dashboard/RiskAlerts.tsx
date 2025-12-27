import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Permission } from '@/lib/mockData';

interface RiskAlertsProps {
  permissions: Permission[];
}

export function RiskAlerts({ permissions }: RiskAlertsProps) {
  const alerts = [
    {
      id: '1',
      type: 'high-value',
      icon: AlertTriangle,
      title: 'High Value Permission',
      description: 'Uniswap V3 has unlimited USDC approval',
      severity: 'warning',
      permission: permissions.find(p => p.id === '1'),
    },
    {
      id: '2',
      type: 'unverified',
      icon: AlertCircle,
      title: 'Unverified Contract',
      description: 'Unknown contract with USDT access',
      severity: 'destructive',
      permission: permissions.find(p => p.id === '2'),
    },
    {
      id: '3',
      type: 'old',
      icon: Clock,
      title: 'Old Permission',
      description: 'Permission older than 30 days',
      severity: 'muted',
      permission: permissions.find(p => p.id === '4'),
    },
  ];

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'destructive':
        return 'border-destructive/30 bg-destructive/5';
      case 'warning':
        return 'border-warning/30 bg-warning/5';
      default:
        return 'border-border bg-secondary/30';
    }
  };

  const getIconStyles = (severity: string) => {
    switch (severity) {
      case 'destructive':
        return 'text-destructive bg-destructive/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Risk Alerts</h2>
          <p className="text-sm text-muted-foreground">Permissions requiring attention</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 hover:bg-secondary/20",
              getSeverityStyles(alert.severity)
            )}
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              getIconStyles(alert.severity)
            )}>
              <alert.icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium">{alert.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{alert.description}</p>
            </div>

            <Button variant="ghost" size="sm" className="shrink-0 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10">
              <XCircle className="w-4 h-4" />
              Revoke
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
