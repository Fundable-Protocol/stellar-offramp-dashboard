import { useSuspenseQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchOfframpStats, fetchRecentOfframps } from '../lib/api';

export function useOfframpStats() {
  return useSuspenseQuery({
    queryKey: ['offramp-stats'],
    queryFn: fetchOfframpStats,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export function useRecentOfframps(page: number, limit: number = 10) {
  return useSuspenseQuery({
    queryKey: ['recent-offramps', page, limit],
    queryFn: () => fetchRecentOfframps(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}
