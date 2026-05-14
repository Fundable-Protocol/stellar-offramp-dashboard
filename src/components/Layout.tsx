import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-white font-inter">
      <header className="console-nav sticky top-0 z-20">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-10 w-10 shrink-0 items-center overflow-hidden rounded-md">
              <img
                src="/dashboard_fundable_logo.png"
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </span>
            <span className="hidden text-2xl font-medium capitalize text-white lg:block">
              Fundable
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://stellar.expert"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-md border border-fundable-mid-grey bg-fundable-mid-dark px-3 py-2 text-xs font-medium text-fundable-light-grey transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fundable-purple-2 sm:flex"
            >
              Explorer
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>

      <footer className="relative z-10 border-t border-fundable-mid-dark px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 text-xs text-fundable-light-grey sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Fundable Protocol. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
