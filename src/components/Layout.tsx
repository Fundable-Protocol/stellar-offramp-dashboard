import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-inter">
      {/* Top Navbar */}
      <header className="border-b border-border/20 bg-[#0d0019] px-6 py-4 flex justify-between items-center z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-fundable-gradient animate-pulse flex items-center justify-center font-bold">
            F
          </div>
          <span className="text-xl font-semibold tracking-wide text-fundable-faint-white">
            Fundable Offramp
          </span>
        </div>
        <nav>
          <div className="btn-wrapper">
            <span className="btn-grad"></span>
            <button className="btn-bottom-grad text-xs px-5">
              Connect Wallet
            </button>
          </div>
        </nav>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container xl py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 text-center py-4 text-sm text-fundable-light-grey bg-fundable-mid-dark">
        &copy; {new Date().getFullYear()} Fundable Protocol
      </footer>
    </div>
  );
}
