function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-white/[0.04] ${className ?? ''}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-8 w-8 rounded-lg" />
        </div>
        <Shimmer className="h-8 w-28" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-white/[0.03]">
      <td className="py-3.5 px-5"><Shimmer className="h-4 w-20" /></td>
      <td className="py-3.5 px-5"><Shimmer className="h-5 w-12 rounded-md" /></td>
      <td className="py-3.5 px-5"><Shimmer className="h-4 w-16" /></td>
      <td className="py-3.5 px-5"><Shimmer className="h-4 w-20" /></td>
      <td className="py-3.5 px-5"><Shimmer className="h-5 w-20 rounded-lg" /></td>
    </tr>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-white/[0.04]">
          {['Transaction Hash', 'Asset', 'Amount', 'Time', 'Status'].map((h) => (
            <th
              key={h}
              className="py-3 px-5 text-[10px] font-semibold text-fundable-light-grey uppercase tracking-widest"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </tbody>
    </table>
  );
}
