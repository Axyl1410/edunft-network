import { Card } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function UserProfileSkeleton() {
  return (
    <Card className="mt-4 overflow-hidden rounded-2xl p-0 shadow-lg dark:border-gray-900 dark:bg-gray-950">
      <div className="flex flex-col md:flex-row">
        {/* Left: Banner + Avatar */}
        <div className="flex flex-col items-center bg-gradient-to-b from-blue-200 to-indigo-200 p-0 md:w-1/3 md:px-4 md:py-8 dark:from-gray-900 dark:to-gray-800">
          <div className="relative h-32 w-full md:h-40">
            <Skeleton className="h-full w-full md:rounded-xl" />
            <div className="absolute left-1/2 top-24 -translate-x-1/2 -translate-y-1/2 md:left-auto md:right-4 md:top-24 md:-translate-y-0 md:translate-x-0">
              <Skeleton className="h-24 w-24 rounded-full border-4 border-white shadow-lg dark:border-gray-900" />
            </div>
          </div>
          <div className="mt-8 hidden md:block" />
        </div>
        {/* Right: Info + Stats */}
        <div className="flex flex-1 flex-col items-center px-4 py-8 md:items-start md:px-8 md:py-8">
          <div className="flex w-full flex-col md:flex-row md:items-center md:gap-4">
            <div className="flex-1 text-center md:text-left">
              <Skeleton className="mx-auto mb-1 h-6 w-32 md:mx-0" />
              <Skeleton className="mx-auto mb-1 h-4 w-24 md:mx-0" />
              <Skeleton className="mx-auto mt-1 h-5 w-20 rounded-full md:mx-0" />
            </div>
            <div className="mt-4 flex w-full justify-center md:mt-0 md:w-auto md:justify-end">
              <div className="bg-muted/60 grid w-full grid-cols-3 gap-4 rounded-xl p-4 shadow-sm md:w-auto dark:bg-gray-900/60">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Skeleton className="mb-1 h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-8" />
                    <Skeleton className="mt-1 h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
