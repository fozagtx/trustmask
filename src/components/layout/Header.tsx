import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell, Search } from 'lucide-react';
import { LiquidButton, MetalButton } from '@/components/ui/liquid-glass-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAccount } from 'wagmi';
import logo from '@/assets/logo.png';

export function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="sticky top-4 z-30 mx-auto w-fit px-4">
      <div className="flex items-center justify-between h-12 px-4 rounded-[4px] border border-border/50 bg-background/60 backdrop-blur-xl shadow-lg shadow-black/5 gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="TrustMusk" className="w-10 h-10 object-contain" />
          <span className="text-lg font-bold gradient-text hidden sm:block">TrustMusk</span>
        </div>

        {/* Search Bar - Only show when connected */}
        {isConnected && (
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions, tokens..."
                className="pl-10 bg-secondary/30 border-border/30 rounded-xl h-9"
              />
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          
          {isConnected && (
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
              >
                3
              </Badge>
            </Button>
          )}

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
