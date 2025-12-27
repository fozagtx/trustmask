import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell, Search } from 'lucide-react';
import { LiquidButton, MetalButton } from '@/components/ui/liquid-glass-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search permissions, tokens, addresses..."
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            3
          </Badge>
        </Button>

        <div className="h-6 w-px bg-border" />

        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <MetalButton onClick={openConnectModal} variant="primary">
                        Connect Wallet
                      </MetalButton>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <MetalButton onClick={openChainModal} variant="error">
                        Wrong network
                      </MetalButton>
                    );
                  }

                  return (
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={openChainModal}
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex items-center gap-2"
                      >
                        {chain.hasIcon && chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                        {chain.name}
                      </Button>

                      <LiquidButton
                        onClick={openAccountModal}
                        size="sm"
                      >
                        <span className="font-mono">{account.displayName}</span>
                        {account.displayBalance && (
                          <span className="hidden sm:inline ml-2 text-muted-foreground">
                            {account.displayBalance}
                          </span>
                        )}
                      </LiquidButton>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
}
