import { motion } from 'framer-motion';
import { Bell, MessageCircle, Mail, Smartphone, Save, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Notifications() {
  const [discordEnabled, setDiscordEnabled] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [threshold, setThreshold] = useState([1000]);
  const [highRiskAlerts, setHighRiskAlerts] = useState(true);

  const handleSave = () => {
    toast.success('Notification settings saved successfully');
  };

  const handleTest = () => {
    toast.info('Test notification sent! Check your connected channels.');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Configure alerts for permission changes</p>
      </div>

      {/* Notification Channels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Notification Channels</h2>
            <p className="text-sm text-muted-foreground">Choose how you want to receive alerts</p>
          </div>
        </div>

        {/* Discord */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#5865F2]" />
            </div>
            <div>
              <Label className="text-base">Discord</Label>
              <p className="text-sm text-muted-foreground">Get alerts via Discord webhook</p>
            </div>
          </div>
          <Switch checked={discordEnabled} onCheckedChange={setDiscordEnabled} />
        </div>
        {discordEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pl-14"
          >
            <Input 
              placeholder="https://discord.com/api/webhooks/..." 
              className="bg-secondary/50"
            />
          </motion.div>
        )}

        {/* Telegram */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#229ED9]/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#229ED9]" />
            </div>
            <div>
              <Label className="text-base">Telegram</Label>
              <p className="text-sm text-muted-foreground">Get alerts via Telegram bot</p>
            </div>
          </div>
          <Switch checked={telegramEnabled} onCheckedChange={setTelegramEnabled} />
        </div>
        {telegramEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pl-14 space-y-3"
          >
            <Input 
              placeholder="Bot Token" 
              className="bg-secondary/50"
            />
            <Input 
              placeholder="Chat ID" 
              className="bg-secondary/50"
            />
          </motion.div>
        )}

        {/* Email */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-success" />
            </div>
            <div>
              <Label className="text-base">Email</Label>
              <p className="text-sm text-muted-foreground">Get alerts via email</p>
            </div>
          </div>
          <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
        </div>
        {emailEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pl-14"
          >
            <Input 
              type="email"
              placeholder="your@email.com" 
              className="bg-secondary/50"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Alert Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-6"
      >
        <div className="pb-4 border-b border-border">
          <h2 className="text-lg font-semibold">Alert Filters</h2>
          <p className="text-sm text-muted-foreground">Customize when you receive alerts</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Minimum Amount Threshold</Label>
              <span className="text-sm font-mono text-primary">${threshold[0].toLocaleString()}</span>
            </div>
            <Slider
              value={threshold}
              onValueChange={setThreshold}
              min={100}
              max={100000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>$100</span>
              <span>$100,000</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <Label className="text-base">High-Risk Spender Alerts</Label>
              <p className="text-sm text-muted-foreground">Alert when approving unverified contracts</p>
            </div>
            <Switch checked={highRiskAlerts} onCheckedChange={setHighRiskAlerts} />
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button variant="glow" onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
        <Button variant="outline" onClick={handleTest} className="gap-2">
          <TestTube className="w-4 h-4" />
          Send Test Alert
        </Button>
      </div>
    </div>
  );
}
