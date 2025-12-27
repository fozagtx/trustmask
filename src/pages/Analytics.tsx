import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Permission trends and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="7d">
            <SelectTrigger className="w-[140px] bg-secondary/50">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Granted', value: '156', change: '+12%' },
          { label: 'Total Revoked', value: '48', change: '+5%' },
          { label: 'Avg Permission Age', value: '18 days', change: '-3%' },
          { label: 'Most Approved', value: 'Uniswap', change: '' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4"
          >
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            {stat.change && (
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {stat.change} from last period
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>

      <AnalyticsCharts />
    </div>
  );
}
