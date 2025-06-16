"use client";

import { useFetch } from "@/hooks/use-query";

interface Repository {
  full_name: string;
  description: string;
  subscribers_count: number;
  stargazers_count: number;
  forks_count: number;
}

export default function Page() {
  const { data, isPending, error, isFetching } = useFetch<Repository>(
    "https://api.github.com/repos/TanStack/query",
    ["repoData"],
  );

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="max-w-md">
        <h1>{data.full_name}</h1>
        <p>{data.description}</p>
        <strong>👀 {data.subscribers_count}</strong>{" "}
        <strong>✨ {data.stargazers_count}</strong>{" "}
        <strong>🍴 {data.forks_count}</strong>
        <div>{isFetching ? "Updating..." : ""}</div>
      </div>
    </div>
  );
}
