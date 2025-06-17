"use client";

import CollectionCard from "@/components/nft/collection-card";
import { Collection } from "@/types";
import { Button } from "@workspace/ui/components/button";
import Loading from "@workspace/ui/components/loading";
import Link from "next/link";
import { useState } from "react";

interface CollectionsGridProps {
  initialCollections: Collection[];
}

export function CollectionsGrid({ initialCollections }: CollectionsGridProps) {
  const [collections, setCollections] =
    useState<Collection[]>(initialCollections);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);

  return (
    <div className="min-h-[200px]">
      {loadingCollections && (
        <div className="mb-4 flex w-full animate-pulse justify-center text-sm font-medium text-gray-500">
          <Loading text="Loading collections..." />
        </div>
      )}

      {!loadingCollections && collections.length === 0 && (
        <p className="text-center text-sm font-bold">
          Looks like there are no listed NFTs in this collection. Check back
          later!
        </p>
      )}

      {collections.length > 0 && (
        <>
          <div className="grid grid-cols-2 place-items-center gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {collections.slice(0, visibleCount).map((collection) => (
              <Link
                key={collection.address}
                href={`/buy/${collection.address}`}
                className="block h-full w-full"
              >
                <CollectionCard
                  address={collection.address}
                  name={collection.name}
                />
              </Link>
            ))}
          </div>
          {visibleCount < collections.length && (
            <div className="mt-6 flex w-full justify-center">
              <Button
                variant={"ghost"}
                onClick={() => setVisibleCount((prev) => prev + 20)}
              >
                Load more
              </Button>
            </div>
          )}
          {!loadingCollections && visibleCount >= collections.length && (
            <div className="mt-8 grid w-full place-content-center">
              <p className="text-sm font-bold">End of listed for sale</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
