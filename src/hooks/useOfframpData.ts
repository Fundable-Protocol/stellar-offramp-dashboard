import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchOfframpStats, fetchRecentDistributions, fetchRecentOfframps } from '../lib/api';
import type { OfframpStats } from '../types/api';

const DEFAULT_OFFRAMP_STATS: OfframpStats = {
  totalVolume: 0,
  totalTransactions: 0,
  activeWallets: 0,
  volume24h: 0,
  totalDistributionAmount: 0,
  totalDistributionCount: 0,
};

export function useOfframpStats() {
  return useQuery({
    queryKey: ['offramp-stats'],
    queryFn: fetchOfframpStats,
    initialData: DEFAULT_OFFRAMP_STATS,
    initialDataUpdatedAt: 0,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export function useRecentOfframps(page: number, limit: number = 10, enabled: boolean = true) {
  return useQuery({
    queryKey: ['recent-offramps', page, limit],
    queryFn: () => fetchRecentOfframps(page, limit),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}

export function useRecentDistributions(page: number, limit: number = 10, enabled: boolean = true) {
  return useQuery({
    queryKey: ['recent-distributions', page, limit],
    queryFn: () => fetchRecentDistributions(page, limit),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}
