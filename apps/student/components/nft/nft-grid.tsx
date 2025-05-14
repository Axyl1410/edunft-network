import { Skeleton } from "@workspace/ui/components/skeleton";

export function NFTGridLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {[...Array(12)].map((_, index) => (
        <LoadingNFTComponent key={index} />
      ))}
    </div>
  );
}

export function LoadingNFTComponent() {
  return (
    <div className="h-[350px] w-full rounded-lg">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
