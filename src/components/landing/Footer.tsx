import { Github, Twitter, MessageCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 mt-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="TrustMusk" className="w-8 h-8 object-contain" />
          <span className="font-bold gradient-text">TrustMusk</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">About</a>
          <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        </div>

        {/* Social */}
        <div className="flex items-center gap-3">
          <a href="#" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
            <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </a>
          <a href="#" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
            <Github className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </a>
          <a href="#" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
            <MessageCircle className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </a>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-8">
        © {new Date().getFullYear()} TrustMusk. All rights reserved. Built for a safer Web3.
      </div>
    </footer>
  );
}
