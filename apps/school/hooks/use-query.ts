import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface FetchOptions<T>
  extends Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> {
  enabled?: boolean;
}

interface MutationOptions<T, V>
  extends Omit<UseMutationOptions<T, AxiosError, V>, "mutationFn"> {}

export function useFetch<T>(
  url: string,
  queryKey: string[],
  options?: FetchOptions<T>,
) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const response = await axios.get(url);
      if (axios.isAxiosError(response)) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.data;
    },
    ...options,
  });
}

export function usePost<T, V = any>(
  url: string,
  options?: MutationOptions<T, V>,
) {
  return useMutation<T, AxiosError, V>({
    mutationFn: async (data) => {
      const response = await axios.post(url, data);
      if (axios.isAxiosError(response)) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.data;
    },
    ...options,
  });
}

export function usePut<T, V = any>(
  url: string,
  options?: MutationOptions<T, V>,
) {
  return useMutation<T, AxiosError, V>({
    mutationFn: async (data) => {
      const response = await axios.put(url, data);
      if (axios.isAxiosError(response)) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.data;
    },
    ...options,
  });
}

// Example usage:
/*
// GET request
const { data, isLoading, error } = useFetch<Repository>(
  'https://api.github.com/repos/TanStack/query',
  ['repoData']
);

// POST request
const { mutate, isLoading, error } = usePost<UserInfo, LoginData>(
  '/api/auth/login',
  {
    onSuccess: (data) => {
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  }
);

// PUT request
const { mutate, isLoading, error } = usePut<UserInfo, UpdateData>(
  '/api/user/profile',
  {
    onSuccess: (data) => {
      console.log('Profile updated:', data);
    },
    onError: (error) => {
      console.error('Update failed:', error);
    }
  }
);
*/
