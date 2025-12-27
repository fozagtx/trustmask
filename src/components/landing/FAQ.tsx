import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What are token approvals?',
    answer: 'Token approvals are permissions you grant to smart contracts (like DEXs or DeFi protocols) to spend your tokens on your behalf. While necessary for trading and DeFi, unlimited approvals can be risky if the contract is exploited.',
  },
  {
    question: 'Is TrustMusk safe to use?',
    answer: 'Yes! TrustMusk is a read-only tool that only scans your wallet for existing approvals. We never ask for your private keys or seed phrase. All revocation transactions require your explicit approval in your wallet.',
  },
  {
    question: 'What chains are supported?',
    answer: 'We currently support Ethereum Mainnet, Sepolia Testnet, and Monad Testnet. More chains including Polygon, Arbitrum, and Base are coming soon.',
  },
  {
    question: 'How much does it cost to revoke an approval?',
    answer: 'Revoking an approval requires a small gas fee paid in the native token of the chain (ETH for Ethereum). TrustMusk does not charge any additional fees.',
  },
  {
    question: 'Why should I revoke unused approvals?',
    answer: 'Unused approvals pose a security risk. If a contract you approved gets hacked or has a vulnerability, attackers could drain the tokens you approved. Revoking unused approvals is a best practice for wallet hygiene.',
  },
  {
    question: 'Can I revoke multiple approvals at once?',
    answer: 'Yes! TrustMusk supports batch revocation, allowing you to revoke multiple approvals in a single transaction, saving time and gas fees.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 scroll-mt-24">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-4"
        >
          Frequently Asked <span className="gradient-text">Questions</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-lg mx-auto"
        >
          Everything you need to know about managing your token approvals
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card border-border/50 px-6 rounded-xl overflow-hidden"
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
