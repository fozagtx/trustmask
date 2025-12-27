import { motion } from 'framer-motion';
import { User, Palette, Shield, Wallet, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAccount, useDisconnect } from 'wagmi';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [autoRevoke, setAutoRevoke] = useState(false);
  const [showTestnets, setShowTestnets] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Wallet Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Wallet</h2>
            <p className="text-sm text-muted-foreground">Manage your connected wallet</p>
          </div>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">Connected Address</Label>
              <p className="font-mono text-sm mt-1">{address}</p>
            </div>
            <Button variant="destructive" onClick={() => disconnect()}>
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">No wallet connected</p>
        )}
      </motion.div>

      {/* Display Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2 rounded-lg bg-primary/10">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Display</h2>
            <p className="text-sm text-muted-foreground">Customize your interface</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Default Currency</Label>
            <Select defaultValue="usd">
              <SelectTrigger className="w-[200px] bg-secondary/50">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="eth">ETH (Ξ)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Show Testnets</Label>
              <p className="text-sm text-muted-foreground">Display testnet chains in selectors</p>
            </div>
            <Switch checked={showTestnets} onCheckedChange={setShowTestnets} />
          </div>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="text-sm text-muted-foreground">Advanced security settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Auto-revoke Old Permissions</Label>
              <p className="text-sm text-muted-foreground">Automatically revoke permissions older than 90 days</p>
            </div>
            <Switch checked={autoRevoke} onCheckedChange={setAutoRevoke} />
          </div>

          <div>
            <Label className="mb-2 block">Trusted Spenders</Label>
            <Input 
              placeholder="Add contract address..."
              className="bg-secondary/50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Permissions from trusted spenders won't trigger high-risk alerts
            </p>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <Button variant="glow" onClick={handleSave} className="gap-2">
        <Save className="w-4 h-4" />
        Save All Settings
      </Button>
    </div>
  );
}
