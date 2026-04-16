import { Suspense } from 'react';
import { DollarSign, Activity, Wallet, ArrowUpRight, RefreshCw, type LucideIcon } from 'lucide-react';
import { useOfframpStats } from '../hooks/useOfframpData';
import { formatCurrencyAbbr, formatNumber } from '../lib/formatters';
import { StatCardSkeleton, TableSkeleton } from './Skeleton';
import ErrorBoundary from './ErrorBoundary';
import TransactionTable from './TransactionTable';

interface StatCardConfig {
  label: string;
  key: 'totalVolume' | 'totalTransactions' | 'activeWallets' | 'volume24h';
  icon: LucideIcon;
  accent: string;
  bgGlow: string;
  iconBg: string;
  borderHover: string;
}

const statCards: StatCardConfig[] = [
  {
    label: 'Total Volume (USD)',
    key: 'totalVolume',
    icon: DollarSign,
    accent: '#10b981',
    bgGlow: 'rgba(16, 185, 129, 0.06)',
    iconBg: 'rgba(16, 185, 129, 0.08)',
    borderHover: 'rgba(16, 185, 129, 0.25)',
  },
  {
    label: 'Total Transactions',
    key: 'totalTransactions',
    icon: Activity,
    accent: '#60a5fa',
    bgGlow: 'rgba(96, 165, 250, 0.06)',
    iconBg: 'rgba(96, 165, 250, 0.08)',
    borderHover: 'rgba(96, 165, 250, 0.25)',
  },
  {
    label: 'Active Wallets',
    key: 'activeWallets',
    icon: Wallet,
    accent: '#a78bfa',
    bgGlow: 'rgba(167, 139, 250, 0.06)',
    iconBg: 'rgba(167, 139, 250, 0.08)',
    borderHover: 'rgba(167, 139, 250, 0.25)',
  },
  {
    label: '24h Volume',
    key: 'volume24h',
    icon: ArrowUpRight,
    accent: '#fbbf24',
    bgGlow: 'rgba(251, 191, 36, 0.06)',
    iconBg: 'rgba(251, 191, 36, 0.08)',
    borderHover: 'rgba(251, 191, 36, 0.25)',
  },
];

function formatStatValue(key: StatCardConfig['key'], value: number): string {
  if (key === 'totalVolume' || key === 'volume24h') return formatCurrencyAbbr(value);
  return formatNumber(value);
}

function StatsCards() {
  const { data, dataUpdatedAt, refetch, isFetching } = useOfframpStats();

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--';

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 text-xs text-fundable-light-grey hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Last updated: {lastUpdated}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="group relative glass rounded-2xl p-5 transition-all duration-300 overflow-hidden"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = stat.borderHover;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
            }}
          >
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
              style={{ background: stat.bgGlow }}
            />
            <div
              className="absolute bottom-0 left-4 right-4 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(90deg, transparent, ${stat.accent}40, transparent)` }}
            />
            <div className="relative flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-fundable-light-grey tracking-wide">
                  {stat.label}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: stat.iconBg }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: stat.accent }} />
                </div>
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">
                {formatStatValue(stat.key, data[stat.key])}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StatsCardsSkeleton() {
  return (
    <>
      <div className="flex justify-end">
        <div className="flex items-center gap-2 text-xs text-fundable-light-grey">
          <RefreshCw className="w-3.5 h-3.5" />
          Last updated: --
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

function TableFallback() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="h-5 w-36 rounded-md bg-white/[0.04]" />
      </div>
      <TableSkeleton rows={5} />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase text-fundable-purple-2 bg-fundable-purple-2/10 px-2.5 py-1 rounded-full border border-fundable-purple-2/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-hero tracking-tight">
            Transparency Dashboard
          </h1>
          <p className="text-fundable-light-grey mt-1.5 text-sm">
            Real-time metrics on fiat offramps processed via the Stellar network.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <ErrorBoundary>
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards />
        </Suspense>
      </ErrorBoundary>

      {/* Transaction Table */}
      <ErrorBoundary>
        <Suspense fallback={<TableFallback />}>
          <TransactionTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
