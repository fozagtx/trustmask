import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from '@/lib/wagmi';
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { ShaderBackground } from "@/components/ui/shader-background";
import Dashboard from "./pages/Dashboard";
import PermissionsPage from "./pages/Permissions";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useAccount } from "wagmi";

const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useTheme();
  const { isConnected } = useAccount();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <RainbowKitProvider 
      theme={isDark ? darkTheme({
        accentColor: '#f97316',
        accentColorForeground: 'white',
        borderRadius: 'medium',
        fontStack: 'system',
      }) : lightTheme({
        accentColor: '#f97316',
        accentColorForeground: 'white',
        borderRadius: 'medium',
        fontStack: 'system',
      })}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ShaderBackground />
        <BrowserRouter>
          <div className="min-h-screen w-full relative">
            <Header />
            <div className="flex w-full">
              {isConnected && <Sidebar />}
              <main className={`flex-1 p-6 pt-4 lg:p-8 lg:pt-4 overflow-auto ${!isConnected ? 'mx-auto' : ''}`}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/permissions" element={<PermissionsPage />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </RainbowKitProvider>
  );
}

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="trustmusk-theme">
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  </ThemeProvider>
);

export default App;
