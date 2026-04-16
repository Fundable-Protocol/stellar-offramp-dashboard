/**
 * Format a number as abbreviated currency: $1.42M, $24.5K, $850
 */
export function formatCurrencyAbbr(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${parseFloat(m.toFixed(2))}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `$${parseFloat(k.toFixed(1))}K`;
  }
  return `$${value.toFixed(0)}`;
}

/**
 * Format a number with commas: 45231 → "45,231"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Format a number as currency: 1200 → "$1,200"
 */
export function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Format an ISO date string as relative time: "2 mins ago", "1 hour ago"
 */
export function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

/**
 * Truncate a tx hash: "fb7ae3d1f..." → "fb7ae..."
 */
export function truncateHash(hash: string): string {
  if (hash.length <= 9) return hash;
  return `${hash.slice(0, 6)}...`;
}
