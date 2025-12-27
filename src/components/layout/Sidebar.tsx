import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  BarChart3, 
  Settings, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/permissions', label: 'Permissions', icon: Shield },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-[280px] border-r border-border bg-sidebar",
          "lg:translate-x-0 lg:static"
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-lg opacity-50" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">PermissionGuard</h1>
              <p className="text-xs text-muted-foreground">Blockchain Monitor</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-border">
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-2">Powered by</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Envio</span>
                <span className="text-muted-foreground">×</span>
                <span className="text-sm font-medium">MetaMask</span>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
