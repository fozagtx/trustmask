import { motion } from 'framer-motion';
import { Wallet, Search, ShieldCheck, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    title: 'Connect Your Wallet',
    description: 'Securely connect your wallet using MetaMask, WalletConnect, or any supported wallet.',
  },
  {
    icon: Search,
    title: 'Scan Approvals',
    description: 'We automatically scan all your token approvals across multiple chains.',
  },
  {
    icon: ShieldCheck,
    title: 'Review Permissions',
    description: 'See exactly which contracts have access to your tokens and for how much.',
  },
  {
    icon: CheckCircle,
    title: 'Revoke & Secure',
    description: 'Revoke risky or unused approvals with a single click to protect your assets.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-4"
        >
          How It <span className="gradient-text">Works</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-lg mx-auto"
        >
          Protect your crypto assets in four simple steps
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 text-center relative"
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {index + 1}
            </div>
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
              <step.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
