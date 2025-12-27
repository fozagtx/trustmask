import { StatsCards } from '@/components/dashboard/StatsCards';
import { ActivityTable } from '@/components/dashboard/ActivityTable';
import { RiskAlerts } from '@/components/dashboard/RiskAlerts';
import { HealthScore } from '@/components/dashboard/HealthScore';
import { useApprovalEvents, usePermissionStats } from '@/hooks/useApprovalEvents';
import { motion } from 'framer-motion';
import { useAccount, useChainId } from 'wagmi';
import { Sparkles, Zap, Lock, ArrowRight, Loader2, AlertCircle, Shield } from 'lucide-react';
import { MetalButton, LiquidButton } from '@/components/ui/liquid-glass-button';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function ConnectPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Monitor & Manage Your <span className="gradient-text">Blockchain Permissions</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          Stay safe from unlimited approvals and malicious contracts. 
          Connect your wallet to get started.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <MetalButton onClick={openConnectModal} variant="primary">
                Connect Wallet
                <ArrowRight className="w-5 h-5 ml-2" />
              </MetalButton>
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

function getChainDisplayName(chainId: number): string {
  switch (chainId) {
    case 1: return 'Ethereum Mainnet';
    case 11155111: return 'Sepolia Testnet';
    case 41454: return 'Monad Testnet';
    default: return 'Unknown Chain';
  }
}

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { data, isLoading, error } = useApprovalEvents();
  const stats = usePermissionStats();

  if (!isConnected) {
    return <ConnectPrompt />;
  }

  const permissions = data?.permissions || [];
  const activities = data?.activities || [];

  // Calculate health score based on real data
  const healthScore = permissions.length > 0 
    ? Math.round(permissions.reduce((sum, p) => sum + p.riskScore, 0) / permissions.length)
    : 100; // Perfect score if no risky permissions

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {isLoading 
              ? 'Scanning blockchain for approvals...' 
              : `Connected to ${getChainDisplayName(chainId)}`
            }
          </p>
        </div>
        {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
      </div>

      {/* Status message */}
      {!isLoading && permissions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 border-success/30 bg-success/5"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-success/20">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-medium text-success mb-1">No Active Approvals Found</h3>
              <p className="text-sm text-muted-foreground">
                Great news! Your wallet ({address?.slice(0, 6)}...{address?.slice(-4)}) has no active token approvals 
                on {getChainDisplayName(chainId)}. This means no contracts can spend your tokens without your permission.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Try switching networks or use DeFi protocols to see approvals here.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 border-warning/50"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-warning" />
            <p className="text-sm text-warning">
              Error fetching data. Please try refreshing or switching networks.
            </p>
          </div>
        </motion.div>
      )}

      <StatsCards stats={stats} />

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
            <h3 className="text-lg font-semibold mb-4">Security Score</h3>
            <HealthScore score={healthScore} size="lg" />
            <p className="text-xs text-muted-foreground mt-4 text-center">
              {healthScore >= 80 
                ? 'Your wallet permissions are well managed' 
                : healthScore >= 50 
                  ? 'Consider reviewing some permissions'
                  : 'High risk - review your approvals immediately'
              }
            </p>
          </motion.div>
          <RiskAlerts permissions={permissions} />
        </div>
      </div>
    </div>
  );
}
