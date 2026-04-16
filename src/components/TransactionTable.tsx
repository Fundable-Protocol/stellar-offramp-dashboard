import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import {
  ArrowUpRight,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useRecentOfframps } from '../hooks/useOfframpData';
import { formatCurrency, formatRelativeTime, truncateHash } from '../lib/formatters';
import { TableSkeleton } from './Skeleton';
import type { RecentOfframp } from '../types/api';

const ITEMS_PER_PAGE = 10;

const assetStyles: Record<string, string> = {
  USDC: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  USDT: 'bg-teal-500/15 text-teal-300 border-teal-500/20',
  XLM: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  EURC: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
};

const statusStyles: Record<string, { dot: string; badge: string }> = {
  completed: {
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  processing: {
    dot: 'bg-amber-400 animate-pulse',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  pending: {
    dot: 'bg-amber-400 animate-pulse',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  failed: {
    dot: 'bg-red-400',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
};

const columnHelper = createColumnHelper<RecentOfframp>();

export default function TransactionTable() {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const { data: response, isLoading, isFetching } = useRecentOfframps(page, ITEMS_PER_PAGE);
  const transactions = response?.data ?? [];
  const meta = response?.meta;

  const columns = useMemo(
    () => [
      columnHelper.accessor('tx_hash', {
        header: 'Transaction Hash',
        cell: (info) => (
          <span className="text-fundable-purple-2 font-mono flex items-center gap-1.5 group-hover/row:text-white transition-colors">
            {truncateHash(info.getValue())}
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/row:opacity-100 transition-opacity text-fundable-light-grey" />
          </span>
        ),
      }),
      columnHelper.accessor('token', {
        header: 'Asset',
        cell: (info) => {
          const asset = info.getValue();
          return (
            <span
              className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${
                assetStyles[asset] || 'bg-white/5 text-white border-white/10'
              }`}
            >
              {asset}
            </span>
          );
        },
      }),
      columnHelper.accessor('amount_usd', {
        header: 'Amount',
        cell: (info) => (
          <span className="tabular-nums text-white font-semibold">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Time',
        cell: (info) => (
          <span className="text-fundable-light-grey">
            {formatRelativeTime(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          const style = statusStyles[status] || statusStyles.completed;
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border capitalize ${style.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {status}
            </span>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: transactions,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Table Header */}
      <div className="px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/[0.06]">
        <h2 className="text-base font-semibold flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Recent Offramps
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fundable-light-grey" />
            <input
              type="text"
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-fundable-placeholder focus:outline-none focus:border-fundable-purple-2/40 transition-colors w-40"
            />
          </div>
          <a
            href="#"
            className="text-xs font-medium text-fundable-purple-2 hover:text-white transition-colors flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/[0.12]"
          >
            View All On Explorer
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {isLoading ? (
        <div className="px-2 py-2">
          <TableSkeleton rows={5} />
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-fundable-light-grey">
          <span className="text-sm">No transactions found.</span>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto distribution-scrollbar relative">
            {isFetching && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-fundable-purple-2" />
              </div>
            )}
            <table className="w-full text-left text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-white/[0.04]">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="py-3 px-5 text-[10px] font-semibold text-fundable-light-grey uppercase tracking-widest cursor-pointer select-none hover:text-white transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <ArrowUpDown className="w-3 h-3 opacity-40" />
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
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group/row cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3.5 px-5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-3 border-t border-white/[0.04] flex justify-between items-center text-xs text-fundable-light-grey">
            <span>
              Page {meta?.currentPage ?? 1} of {meta?.totalPages ?? 1}
              <span className="hidden sm:inline"> &middot; {meta?.totalRows ?? 0} total transactions</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta?.prevPage === null}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={meta?.nextPage === null}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
