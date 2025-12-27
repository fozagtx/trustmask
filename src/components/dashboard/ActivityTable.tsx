import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type ActivityItem } from '@/lib/mockData';

interface ActivityTableProps {
  activities: ActivityItem[];
}

export function ActivityTable({ activities }: ActivityTableProps) {
  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 text-center"
      >
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <p className="text-sm text-muted-foreground">
          No recent approval activity found. When you approve tokens for protocols, activity will appear here.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">{activities.length} events</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Token</th>
              <th>Spender</th>
              <th>Amount</th>
              <th>Chain</th>
              <th>Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <motion.tr
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <td>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1.5 rounded-full",
                      activity.action === 'granted' 
                        ? "bg-success/20" 
                        : "bg-destructive/20"
                    )}>
                      {activity.action === 'granted' ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-destructive" />
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "capitalize",
                        activity.action === 'granted' 
                          ? "border-success/50 text-success" 
                          : "border-destructive/50 text-destructive"
                      )}
                    >
                      {activity.action}
                    </Badge>
                  </div>
                </td>
                <td>
                  <span className="font-medium">{activity.tokenSymbol}</span>
                </td>
                <td>
                  <div>
                    <p className="font-medium">{activity.spenderName}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {activity.spender.slice(0, 6)}...{activity.spender.slice(-4)}
                    </p>
                  </div>
                </td>
                <td className="font-mono">{activity.amount}</td>
                <td>
                  <Badge variant="secondary">{activity.chain}</Badge>
                </td>
                <td className="text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </td>
                <td>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
