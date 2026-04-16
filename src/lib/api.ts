import type {
  OfframpStats,
  RecentOfframpsResponse,
  ApiResponse,
} from "../types/api";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/api/general/public`;

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();
  return json.data;
}

export function fetchOfframpStats(): Promise<OfframpStats> {
  return apiFetch<OfframpStats>("/offramp-stats");
}

export function fetchRecentOfframps(
  page: number,
  limit: number,
): Promise<RecentOfframpsResponse> {
  return apiFetch<RecentOfframpsResponse>(
    `/recent-offramps?page=${page}&limit=${limit}`,
  );
}
