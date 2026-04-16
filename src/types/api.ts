export interface OfframpStats {
  totalVolume: number;
  totalTransactions: number;
  activeWallets: number;
  volume24h: number;
}

export interface RecentOfframp {
  tx_hash: string;
  token: string;
  amount_usd: number;
  created_at: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
}

export interface PaginationMeta {
  prevPage: number | null;
  currentPage: number;
  nextPage: number | null;
  perPage: number;
  totalPages: number;
  totalRows: number;
}

export interface RecentOfframpsResponse {
  data: RecentOfframp[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}
