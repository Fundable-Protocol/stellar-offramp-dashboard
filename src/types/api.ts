export interface OfframpStats {
  totalVolume: number;
  totalTransactions: number;
  activeWallets: number;
  volume24h: number;
  totalDistributionAmount: number;
  totalDistributionCount: number;
}

export interface RecentOfframp {
  tx_hash: string;
  token: string;
  amount_usd: number;
  created_at: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
}

export interface RecentDistribution {
  transaction_hash: string;
  token_symbol: string;
  total_usd_amount: number | string;
  total_recipients: number;
  created_at: string;
  status: 'COMPLETED' | 'completed';
  network: 'MAINNET' | string;
  chain_name: string;
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

export interface RecentDistributionsResponse {
  data: RecentDistribution[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}
