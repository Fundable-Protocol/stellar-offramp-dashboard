import { Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Activity,
  ArrowUpRight,
  DollarSign,
  HandCoins,
  RefreshCw,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { useOfframpStats } from '../hooks/useOfframpData';
import { formatCurrencyAbbr, formatNumber } from '../lib/formatters';
import { StatCardSkeleton, TableSkeleton } from './Skeleton';
import ErrorBoundary from './ErrorBoundary';
import TransactionTable from './TransactionTable';
import type { OfframpStats } from '../types/api';

interface StatCardConfig {
  label: string;
  key: keyof OfframpStats;
  icon: LucideIcon;
  accent: string;
  helper: string;
}

const statCards: StatCardConfig[] = [
  {
    label: 'Total Offramp',
    key: 'totalVolume',
    icon: DollarSign,
    accent: '#8256ff',
    helper: 'Total offramp amount',
  },
  {
    label: 'Transactions',
    key: 'totalTransactions',
    icon: Activity,
    accent: '#b102cd',
    helper: 'Processed offramps',
  },
  {
    label: 'Active Wallets',
    key: 'activeWallets',
    icon: Wallet,
    accent: '#5b21b6',
    helper: 'Wallets with activity',
  },
  {
    label: '24h Volume',
    key: 'volume24h',
    icon: ArrowUpRight,
    accent: '#8256ff',
    helper: 'Processed in the last 24 hours',
  },
  {
    label: 'Distribution',
    key: 'totalDistributionAmount',
    icon: HandCoins,
    accent: '#b102cd',
    helper: 'Total distribution amount',
  },
  {
    label: 'Distribution Count',
    key: 'totalDistributionCount',
    icon: Users,
    accent: '#5b21b6',
    helper: 'Completed distributions',
  },
];

function formatStatValue(key: StatCardConfig['key'], value: number): string {
  if (key === 'totalVolume' || key === 'volume24h' || key === 'totalDistributionAmount') {
    return formatCurrencyAbbr(value);
  }
  return formatNumber(value);
}

function StatsCards() {
  const { data } = useOfframpStats();

  return (
    <section className="flex flex-col gap-3" aria-label="Offramp metrics">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => (
          <div
            key={stat.key}
            className="surface-soft relative overflow-hidden rounded-lg border-l-2 px-4 py-4 transition-colors hover:bg-fundable-mid-dark"
            style={{ borderLeftColor: stat.accent }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-fundable-light-grey">
                  {stat.label}
                </p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-white tabular-nums">
                  {formatStatValue(stat.key, data[stat.key])}
                </p>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black">
                <stat.icon className="h-3.5 w-3.5" style={{ color: stat.accent }} aria-hidden="true" />
              </div>
            </div>
            <p className="mt-3 text-xs text-fundable-light-grey">{stat.helper}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsRefresh() {
  const queryClient = useQueryClient();
  const { dataUpdatedAt, isFetching } = useOfframpStats();

  const lastUpdated = dataUpdatedAt
    ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dataUpdatedAt))
    : '--';

  return (
    <button
      type="button"
      onClick={() => {
        void Promise.all([
          queryClient.invalidateQueries({ queryKey: ['offramp-stats'] }),
          queryClient.invalidateQueries({ queryKey: ['recent-offramps'] }),
          queryClient.invalidateQueries({ queryKey: ['recent-distributions'] }),
        ]);
      }}
      className="inline-flex items-center gap-2 self-start rounded-md border border-white/10 bg-white/[0.025] px-3 py-1.5 text-xs font-medium text-fundable-light-grey transition-colors hover:border-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:self-auto"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} aria-hidden="true" />
      {isFetching ? 'Updating...' : `Updated ${lastUpdated}`}
    </button>
  );
}

function StatsCardsSkeleton() {
  return (
    <section className="flex flex-col gap-3" aria-label="Loading offramp metrics">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-3 w-28 rounded bg-white/[0.05]" />
          <div className="mt-2 h-3 w-56 rounded bg-white/[0.05]" />
        </div>
        <div className="flex items-center gap-2 text-xs text-fundable-light-grey">
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Updating...
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: statCards.length }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

function TableFallback() {
  return (
    <div className="surface overflow-hidden rounded-xl">
      <div className="border-b border-white/[0.07] px-5 py-4">
        <div className="h-5 w-36 rounded-md bg-white/[0.04]" />
      </div>
      <TableSkeleton rows={5} />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-6">
      <section className="flex flex-col justify-between gap-3 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-start">
        <div>
          <h1 className="max-w-3xl text-2xl font-semibold tracking-tight text-white text-balance sm:text-3xl">
            Transparency Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-fundable-light-grey">
            Fiat offramp volume, distribution, and recent settlement activity on Stellar.
          </p>
        </div>
        <StatsRefresh />
      </section>

      <ErrorBoundary>
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<TableFallback />}>
          <TransactionTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
