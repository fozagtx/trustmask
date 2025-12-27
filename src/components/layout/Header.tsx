import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell, Search, Sparkles } from 'lucide-react';
import { LiquidButton, MetalButton } from '@/components/ui/liquid-glass-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="sticky top-4 z-30 mx-4 lg:mx-6">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6 rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-lg shadow-black/5">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 w-9 h-9 bg-primary/30 rounded-xl blur-lg" />
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:block">TrustMusk</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search permissions, tokens..."
              className="pl-10 bg-secondary/30 border-border/30 rounded-xl h-9"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative rounded-xl">
            <Bell className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
            >
              3
            </Badge>
          </Button>

          <div className="h-5 w-px bg-border/50" />

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
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={openChainModal}
                          variant="ghost"
                          size="sm"
                          className="hidden sm:flex items-center gap-2 rounded-xl h-8"
                        >
                          {chain.hasIcon && chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              className="w-4 h-4 rounded-full"
                            />
                          )}
                          <span className="text-xs">{chain.name}</span>
                        </Button>

                        <LiquidButton
                          onClick={openAccountModal}
                          size="sm"
                        >
                          <span className="font-mono text-xs">{account.displayName}</span>
                        </LiquidButton>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}
