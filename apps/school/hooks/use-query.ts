import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

interface FetchOptions<T>
  extends Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> {
  enabled?: boolean;
}

interface MutationOptions<T, V>
  extends Omit<UseMutationOptions<T, Error, V>, "mutationFn"> {}

export function useFetch<T>(
  url: string,
  queryKey: string[],
  options?: FetchOptions<T>,
) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
}

export function usePost<T, V = any>(
  url: string,
  options?: MutationOptions<T, V>,
) {
  return useMutation<T, Error, V>({
    mutationFn: async (data) => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
}

export function usePut<T, V = any>(
  url: string,
  options?: MutationOptions<T, V>,
) {
  return useMutation<T, Error, V>({
    mutationFn: async (data) => {
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        throw error;
      }
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
