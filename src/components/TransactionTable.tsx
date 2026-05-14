import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import {
  ArrowUpRight,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useRecentDistributions, useRecentOfframps } from '../hooks/useOfframpData';
import { formatCurrency, formatNumber, formatRelativeTime } from '../lib/formatters';
import { TableSkeleton } from './Skeleton';
import type { PaginationMeta, RecentDistribution, RecentOfframp } from '../types/api';

const DEFAULT_ITEMS_PER_PAGE = 10;
const perPageOptions = [10, 20, 50];

type LedgerTab = 'offramps' | 'distributions';
type LedgerRow =
  | ({ type: 'offramp' } & RecentOfframp)
  | ({ type: 'distribution' } & RecentDistribution);

const tabs: Array<{ id: LedgerTab; label: string; emptyText: string }> = [
  { id: 'offramps', label: 'Offramps', emptyText: 'No offramps found.' },
  { id: 'distributions', label: 'Distributions', emptyText: 'No distributions found.' },
];

const assetStyles: Record<string, string> = {
  USDC: 'bg-sky-400/[0.08] text-sky-200 border-sky-300/20',
  USDT: 'bg-teal-400/[0.08] text-teal-200 border-teal-300/20',
  XLM: 'bg-violet-400/[0.08] text-violet-200 border-violet-300/20',
  EURC: 'bg-emerald-400/[0.08] text-emerald-200 border-emerald-300/20',
};

const statusStyles: Record<string, { dot: string; badge: string }> = {
  completed: {
    dot: 'bg-emerald-300',
    badge: 'bg-emerald-400/[0.08] text-emerald-200 border-emerald-300/20',
  },
  processing: {
    dot: 'bg-amber-300 animate-pulse',
    badge: 'bg-amber-400/[0.08] text-amber-200 border-amber-300/20',
  },
  pending: {
    dot: 'bg-amber-300 animate-pulse',
    badge: 'bg-amber-400/[0.08] text-amber-200 border-amber-300/20',
  },
  failed: {
    dot: 'bg-rose-300',
    badge: 'bg-rose-400/[0.08] text-rose-200 border-rose-300/20',
  },
};

const columnHelper = createColumnHelper<LedgerRow>();

function getTransactionHash(row: LedgerRow): string {
  return row.type === 'offramp' ? row.tx_hash : row.transaction_hash;
}

function getAsset(row: LedgerRow): string {
  return row.type === 'offramp' ? row.token : row.token_symbol;
}

function getVerificationUrl(row: LedgerRow): string {
  const hash = getTransactionHash(row);

  if (row.type === 'distribution' && row.chain_name.toLowerCase().includes('bnb')) {
    return `https://bscscan.com/tx/${encodeURIComponent(hash)}`;
  }

  return `https://stellar.expert/explorer/public/tx/${encodeURIComponent(hash)}`;
}

function truncateTransactionHash(hash: string): string {
  if (hash.length <= 21) return hash;
  return `${hash.slice(0, 12)}...${hash.slice(-6)}`;
}

function formatStatusLabel(status: string): string {
  return status.toLowerCase().replaceAll('_', ' ');
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();
  const style = statusStyles[normalizedStatus] || statusStyles.completed;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium capitalize ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {formatStatusLabel(status)}
    </span>
  );
}

function AssetBadge({ asset }: { asset: string }) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${
        assetStyles[asset] || 'bg-white/5 text-white border-white/10'
      }`}
    >
      {asset}
    </span>
  );
}

function VerificationHash({ row }: { row: LedgerRow }) {
  const hash = getTransactionHash(row);

  return (
    <a
      href={getVerificationUrl(row)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-sm font-mono text-xs font-semibold text-fundable-purple-2 underline decoration-fundable-purple-2/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fundable-purple-2"
      aria-label={`Verify transaction ${hash}`}
    >
      {truncateTransactionHash(hash)}
      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}

export default function TransactionTable() {
  const [activeTab, setActiveTab] = useState<LedgerTab>('offramps');
  const [offrampPage, setOfframpPage] = useState(1);
  const [distributionPage, setDistributionPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [sorting, setSorting] = useState<SortingState>([]);

  const isOfframpTab = activeTab === 'offramps';
  const activePage = isOfframpTab ? offrampPage : distributionPage;
  const setActivePage = isOfframpTab ? setOfframpPage : setDistributionPage;

  const offrampQuery = useRecentOfframps(offrampPage, itemsPerPage, isOfframpTab);
  const distributionQuery = useRecentDistributions(distributionPage, itemsPerPage, !isOfframpTab);

  const activeResponse = isOfframpTab ? offrampQuery.data : distributionQuery.data;
  const isLoading = isOfframpTab ? offrampQuery.isLoading : distributionQuery.isLoading;
  const isFetching = isOfframpTab ? offrampQuery.isFetching : distributionQuery.isFetching;
  const meta: PaginationMeta | undefined = activeResponse?.meta;
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  const rows: LedgerRow[] = useMemo(() => {
    if (isOfframpTab) {
      return (offrampQuery.data?.data ?? []).map((item) => ({
        ...item,
        type: 'offramp' as const,
      }));
    }

    return (distributionQuery.data?.data ?? []).map((item) => ({
      ...item,
      type: 'distribution' as const,
    }));
  }, [distributionQuery.data?.data, isOfframpTab, offrampQuery.data?.data]);

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor((row) => getTransactionHash(row), {
        id: 'transaction_hash',
        header: 'Transaction Hash',
        cell: ({ row }) => <VerificationHash row={row.original} />,
      }),
      columnHelper.accessor((row) => getAsset(row), {
        id: 'asset',
        header: 'Asset',
        cell: ({ row }) => <AssetBadge asset={getAsset(row.original)} />,
      }),
    ];

    if (isOfframpTab) {
      return [
        ...baseColumns,
        columnHelper.accessor((row) => (row.type === 'offramp' ? row.amount_usd : 0), {
          id: 'amount_usd',
          header: 'Amount',
          cell: ({ row }) => (
            <span className="font-semibold tabular-nums text-white">
              {row.original.type === 'offramp' ? formatCurrency(row.original.amount_usd) : '--'}
            </span>
          ),
        }),
        columnHelper.accessor((row) => row.created_at, {
          id: 'created_at',
          header: 'Time',
          cell: ({ row }) => (
            <span className="text-fundable-light-grey">
              {formatRelativeTime(row.original.created_at)}
            </span>
          ),
        }),
        columnHelper.accessor((row) => row.status, {
          id: 'status',
          header: 'Status',
          cell: ({ row }) => <StatusBadge status={row.original.status} />,
        }),
      ];
    }

    return [
      ...baseColumns,
      columnHelper.accessor((row) => (row.type === 'distribution' ? row.total_usd_amount : ''), {
        id: 'total_usd_amount',
        header: 'Amount',
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums text-white">
            {row.original.type === 'distribution' ? formatCurrency(Number(row.original.total_usd_amount)) : '--'}
          </span>
        ),
      }),
      columnHelper.accessor((row) => (row.type === 'distribution' ? row.total_recipients : 0), {
        id: 'total_recipients',
        header: 'Recipients',
        cell: ({ row }) => (
          <span className="tabular-nums text-fundable-light-grey">
            {row.original.type === 'distribution' ? formatNumber(row.original.total_recipients) : '--'}
          </span>
        ),
      }),
      columnHelper.accessor((row) => row.created_at, {
        id: 'created_at',
        header: 'Time',
        cell: ({ row }) => (
          <span className="text-fundable-light-grey">
            {formatRelativeTime(row.original.created_at)}
          </span>
        ),
      }),
      columnHelper.accessor((row) => (row.type === 'distribution' ? row.chain_name : ''), {
        id: 'chain_name',
        header: 'Chain',
        cell: ({ row }) => (
          <span className="text-fundable-light-grey">
            {row.original.type === 'distribution' ? row.original.chain_name : '--'}
          </span>
        ),
      }),
      columnHelper.accessor((row) => row.status, {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      }),
    ];
  }, [isOfframpTab]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleTabChange = (tab: LedgerTab) => {
    setActiveTab(tab);
    setSorting([]);
  };

  const handleItemsPerPageChange = (value: string) => {
    const nextLimit = Number(value);
    setItemsPerPage(nextLimit);
    setOfframpPage(1);
    setDistributionPage(1);
  };

  return (
    <section className="flex flex-col gap-3" aria-label="Recent activity">
      <div className="flex border-b border-fundable-mid-grey" role="tablist" aria-label="Recent activity type">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(tab.id)}
              className={`relative px-4 pb-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-fundable-light-grey hover:text-white'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-0 -bottom-px h-px bg-fundable-purple-2" />
              )}
            </button>
          );
        })}
      </div>

      <div className="surface overflow-hidden rounded-xl">
        <div className="border-b border-white/[0.07] px-5 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Recent {activeTabConfig.label}
          </h2>
        </div>

      {isLoading || (isFetching && rows.length === 0) ? (
        <div className="px-2 py-2">
          <TableSkeleton rows={5} />
        </div>
      ) : rows.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-fundable-light-grey">
          <span className="text-sm">{activeTabConfig.emptyText}</span>
        </div>
      ) : (
        <>
          <div className={`relative max-h-[520px] overflow-auto distribution-scrollbar ${isFetching ? 'opacity-60' : ''}`}>
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-fundable-mid-dark">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-white/[0.07] bg-white/[0.018]">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="cursor-pointer select-none px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-fundable-light-grey transition-colors hover:text-white"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="flex items-center gap-1.5">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <ArrowUpDown className="h-3 w-3 opacity-40" aria-hidden="true" />
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group/row border-b border-white/[0.045] transition-colors hover:bg-white/[0.025]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/[0.07] px-5 py-3 text-xs text-fundable-light-grey sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span>
                Page {meta?.currentPage ?? activePage} of {meta?.totalPages ?? 1}
                <span className="hidden sm:inline"> &middot; {meta?.totalRows ?? 0} total {activeTabConfig.label.toLowerCase()}</span>
              </span>
              <label className="flex items-center gap-2">
                Rows
                <select
                  value={itemsPerPage}
                  onChange={(event) => handleItemsPerPageChange(event.target.value)}
                  className="rounded-lg border border-transparent bg-transparent px-1.5 py-1 text-xs font-medium text-white transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                >
                  {perPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                type="button"
                aria-label="Previous page"
                onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                disabled={meta?.prevPage === null}
                className="rounded-lg p-1.5 transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next page"
                onClick={() => setActivePage((p) => p + 1)}
                disabled={meta?.nextPage === null}
                className="rounded-lg p-1.5 transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      )}
      </div>
    </section>
  );
}
