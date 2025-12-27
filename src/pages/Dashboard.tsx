import { StatsCards } from '@/components/dashboard/StatsCards';
import { ActivityTable } from '@/components/dashboard/ActivityTable';
import { RiskAlerts } from '@/components/dashboard/RiskAlerts';
import { HealthScore } from '@/components/dashboard/HealthScore';
import { useApprovalEvents, usePermissionStats } from '@/hooks/useApprovalEvents';
import { mockStats, mockActivity, mockPermissions } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Shield, Zap, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function ConnectPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg"
      >
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto bg-primary/30 rounded-2xl blur-2xl" />
        </div>

        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">PermissionGuard</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Monitor and manage your blockchain permissions across multiple chains. 
          Stay safe from unlimited approvals and malicious contracts.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button onClick={openConnectModal} variant="glow" size="xl" className="w-full sm:w-auto">
                Connect Wallet
                <ArrowRight className="w-5 h-5" />
              </Button>
            )}
          </ConnectButton.Custom>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: 'Track Permissions', desc: 'Monitor all token approvals' },
            { icon: Zap, title: 'Real-time Alerts', desc: 'Instant notifications' },
            { icon: Lock, title: 'One-click Revoke', desc: 'Secure your assets' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card p-4 text-left"
            >
              <feature.icon className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  const { isConnected } = useAccount();
  const { data, isLoading, error } = useApprovalEvents();
  const stats = usePermissionStats();

  if (!isConnected) {
    return <ConnectPrompt />;
  }

  // Use real data if available, otherwise fallback to mock
  const permissions = data?.permissions?.length ? data.permissions : mockPermissions;
  const activities = data?.activities?.length ? data.activities : mockActivity;
  const displayStats = data?.permissions?.length ? {
    activePermissions: stats.activePermissions,
    totalValueAtRisk: stats.totalValueAtRisk,
    revokedToday: stats.revokedToday,
    chainsMonitored: stats.chainsMonitored,
    permissionsChange: stats.permissionsChange,
    valueChange: stats.valueChange,
  } : mockStats;

  // Calculate health score based on real data
  const healthScore = permissions.length > 0 
    ? Math.round(permissions.reduce((sum, p) => sum + p.riskScore, 0) / permissions.length)
    : 72;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {isLoading ? 'Fetching on-chain data...' : 'Real-time blockchain permissions'}
          </p>
        </div>
        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 border-warning/50"
        >
          <p className="text-sm text-warning">
            Using demo data. Connect to Ethereum mainnet or Sepolia to see real approvals.
          </p>
        </motion.div>
      )}

      <StatsCards stats={displayStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityTable activities={activities} />
        </div>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Overall Health</h3>
            <HealthScore score={healthScore} size="lg" />
          </motion.div>
          <RiskAlerts permissions={permissions} />
        </div>
      </div>
    </div>
  );
}
