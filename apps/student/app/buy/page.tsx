"use client";

import CollectionCard from "@/components/nft/collection-card";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import { baseUrl } from "@/lib/client";
import { checkCollectionHasNFTs } from "@/services/check-collection-has-nft";
import { Button } from "@workspace/ui/components/button";
import Loading from "@workspace/ui/components/loading";
import axios from "axios";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
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
  const processCollections = useCallback(
    async (collections: Collection[]) => {
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
                const hasNFTs = await checkCollectionHasNFTs(
                  collection.address,
                );
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
    },
    [collections],
  );

  // Re-process when collections change
  useEffect(() => {
    processCollections(collections);
  }, [collections, processCollections]);

  // Connect to socket.io
  useEffect(() => {
    const socket = io(baseUrl.replace(/\/api$/, ""));
    socket.on("collectionUpdate", (data) => {
      // Có thể fetch lại collections hoặc cập nhật trực tiếp nếu muốn
      axios
        .get(baseUrl + "/collections/owners")
        .then((res) => setCollections(res.data))
        .catch(() => toast.error("Error fetching collections (realtime)"));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // Render logic
  return (
    <div className="my-4 px-4">
      <div className="mb-6 flex items-center gap-3">
        <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Buy
        </p>
        <div className="flex items-center gap-1 rounded-md border bg-white/80 px-2 py-0.5 shadow-sm dark:bg-neutral-900">
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
            Live
          </p>
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
          </span>
        </div>
      </div>
      <Suspense fallback={<NFTGridLoading />}>
        <div className="min-h-[200px]">
          {loadingCollections && (
            <div className="mb-4 flex w-full animate-pulse justify-center text-sm font-medium text-gray-500">
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
            <p className="text-center text-sm font-bold">
              Looks like there are no listed NFTs in this collection. Check back
              later!
            </p>
          )}

          {collectionsWithNFTs.length > 0 && (
            <>
              <div className="grid grid-cols-2 place-items-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {collectionsWithNFTs
                  .slice(0, visibleCount)
                  .map((collection) => (
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
