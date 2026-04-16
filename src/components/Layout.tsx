import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#0a0014] text-white font-inter overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-float-delayed" />
        <div className="absolute -bottom-20 left-1/3 w-[350px] h-[350px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-glow-pulse" />
      </div>

      {/* Glass Navbar */}
      <header className="glass-nav px-6 py-3.5 flex justify-between items-center z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-fundable-gradient flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-purple-500/20">
            F
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-wide text-white">
              Fundable
            </span>
            <span className="text-[10px] text-fundable-light-grey font-medium tracking-widest uppercase">
              Offramp Protocol
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://stellar.expert"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-fundable-light-grey hover:text-white transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            Explorer
            <ExternalLink className="w-3 h-3" />
          </a>
          <div className="btn-wrapper">
            <span className="btn-grad"></span>
            <button className="btn-bottom-grad text-xs px-5 font-semibold">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass-nav py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-fundable-light-grey">
          <span>&copy; {new Date().getFullYear()} Fundable Protocol. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Stellar</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
