import { motion } from 'framer-motion';
import { Shield, DollarSign, XCircle, Link2, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type PermissionStats } from '@/lib/mockData';

interface StatsCardsProps {
  stats: PermissionStats;
}

const statConfig = [
  {
    key: 'activePermissions',
    label: 'Active Permissions',
    icon: Shield,
    format: (value: number) => value.toLocaleString(),
    changeKey: 'permissionsChange',
  },
  {
    key: 'totalValueAtRisk',
    label: 'Value at Risk',
    icon: DollarSign,
    format: (value: number) => `$${value.toLocaleString()}`,
    changeKey: 'valueChange',
  },
  {
    key: 'revokedToday',
    label: 'Revoked Today',
    icon: XCircle,
    format: (value: number) => value.toLocaleString(),
  },
  {
    key: 'chainsMonitored',
    label: 'Chains Monitored',
    icon: Link2,
    format: (value: number) => value.toLocaleString(),
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map((stat, index) => {
        const value = stats[stat.key as keyof PermissionStats] as number;
        const change = stat.changeKey ? stats[stat.changeKey as keyof PermissionStats] as number : undefined;
        
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card-hover p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              {change !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  change >= 0 
                    ? "text-success bg-success/10" 
                    : "text-destructive bg-destructive/10"
                )}>
                  {change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(change)}%
                </div>
              )}
            </div>
            <div className="stat-value mb-1">{stat.format(value)}</div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
