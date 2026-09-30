export interface OfframpStats {
  totalVolume: number;
  totalTransactions: number;
  activeWallets: number;
  volume24h: number;
  totalDistributionAmount: number;
  totalDistributionCount: number;
  totalOnrampVolume: number;
  totalOnrampTransactions: number;
  totalOnrampWallets: number;
}

export interface RecentOfframp {
  tx_hash: string;
  token: string;
  amount_usd: number;
  created_at: string;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  source_chain: string | null;
}

export interface RecentDistribution {
  transaction_hash: string | null;
  token_symbol: string;
  total_usd_amount: number | string;
  total_recipients: number;
  created_at: string;
  status: 'COMPLETED' | 'completed';
  network: 'MAINNET' | string;
  chain_name: string;
}

export interface RecentOnramp {
  tx_hash: string | null;
  fiat_currency: string;
  fiat_amount: number | string;
  crypto_currency: string;
  crypto_amount: number;
  network: string;
  rate: number | string | null;
  status: 'settled' | string;
  created_at: string;
  settled_at: string | null;
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

export interface RecentOnrampsResponse {
  data: RecentOnramp[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}
