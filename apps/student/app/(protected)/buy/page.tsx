"use client";

import CollectionCard from "@/components/collection-card";
import { NFTGridLoading } from "@/components/nft-grid";
import { baseUrl } from "@/lib/client";
import { checkCollectionHasNFTs } from "@/services/check-collection-has-nft";
import { Button } from "@workspace/ui/components/button";
import Loading from "@workspace/ui/components/loading";
import axios from "axios";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

interface Collection {
  address: string;
  name: string;
}

export default function Buy() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsWithNFTs, setCollectionsWithNFTs] = useState<Collection[]>(
    [],
  );
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  // Fetch collections on mount
  useEffect(() => {
    axios
      .get(baseUrl + "/collections/owners")
      .then((res) => setCollections(res.data))
      .catch(() => toast.error("Error fetching collections"));
  }, []);

  // Process collections in batches
  const processCollections = useCallback(async (collections: Collection[]) => {
    if (!collections.length) {
      setCollectionsWithNFTs([]);
      return;
    }

    setLoadingCollections(true);
    const batchSize = 5;
    const result: Collection[] = [];
    const totalBatches = Math.ceil(collections.length / batchSize);

    try {
      for (let i = 0; i < collections.length; i += batchSize) {
        setProcessingStatus(
          `Processing batch ${Math.floor(i / batchSize) + 1}/${totalBatches}`,
        );
        const batch = collections.slice(i, i + batchSize);

        const batchResults = await Promise.all(
          batch.map(async (collection) => {
            try {
              const hasNFTs = await checkCollectionHasNFTs(collection.address);
              return hasNFTs ? collection : null;
            } catch {
              return null;
            }
          }),
        );

        result.push(...(batchResults.filter(Boolean) as Collection[]));
        // Optional: If you want progressive UI updates, uncomment below
        setCollectionsWithNFTs([...result]);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      setCollectionsWithNFTs(result);
    } catch (error) {
      toast.error("Failed to process some collections");
    } finally {
      setLoadingCollections(false);
      setProcessingStatus("");
    }
  }, []);

  // Re-process when collections change
  useEffect(() => {
    processCollections(collections);
  }, [collections, processCollections]);

  // Render logic
  return (
    <div className="my-4 px-4">
      <Suspense fallback={<NFTGridLoading />}>
        <div className="min-h-[200px]">
          {loadingCollections && (
            <div className="mb-4 animate-pulse text-sm font-medium text-gray-500">
              <Loading
                text={
                  collectionsWithNFTs.length > 0
                    ? `Loading more collections... ${processingStatus}`
                    : "Searching for available collections..."
                }
              />
            </div>
          )}

          {!loadingCollections && collectionsWithNFTs.length === 0 && (
            <p className="text-sm font-bold">
              Looks like there are no listed NFTs in this collection. Check back
              later!
            </p>
          )}

          {collectionsWithNFTs.length > 0 && (
            <>
              <div className="grid grid-cols-1 place-items-center gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {collectionsWithNFTs
                  .slice(0, visibleCount)
                  .map((collection) => (
                    <Link
                      key={collection.address}
                      href={`/buy/${collection.address}`}
                    >
                      <CollectionCard
                        address={collection.address}
                        name={collection.name}
                      />
                    </Link>
                  ))}
              </div>
              {visibleCount < collectionsWithNFTs.length && (
                <div className="mt-6 flex w-full justify-center">
                  <Button
                    variant={"ghost"}
                    onClick={() => setVisibleCount((prev) => prev + 20)}
                  >
                    Load more
                  </Button>
                </div>
              )}
              {!loadingCollections &&
                visibleCount >= collectionsWithNFTs.length && (
                  <div className="mt-8 grid w-full place-content-center">
                    <p className="text-sm font-bold">End of listed for sale</p>
                  </div>
                )}
            </>
          )}
        </div>
      </Suspense>
    </div>
  );
}
