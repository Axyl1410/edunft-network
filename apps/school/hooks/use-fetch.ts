import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface FetchOptions<T>
  extends Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> {
  enabled?: boolean;
}

export function useFetch<T>(
  url: string,
  queryKey: string[],
  options?: FetchOptions<T>,
) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    ...options,
  });
}

// Example usage:
/*
const { data, isLoading, error } = useFetch<Repository>(
  'https://api.github.com/repos/TanStack/query',
  ['repoData']
);
*/
