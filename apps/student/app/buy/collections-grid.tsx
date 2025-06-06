"use client";

import CollectionCard from "@/components/nft/collection-card";
import { baseUrl } from "@/lib/client";
import { checkCollectionHasNFTs } from "@/services/check-collection-has-nft";
import { Button } from "@workspace/ui/components/button";
import Loading from "@workspace/ui/components/loading";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

interface Collection {
  address: string;
  name: string;
}

interface CollectionsGridProps {
  initialCollections: Collection[];
}

export function CollectionsGrid({ initialCollections }: CollectionsGridProps) {
  const [collections, setCollections] =
    useState<Collection[]>(initialCollections);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  // Process collections in batches
  const processCollections = useCallback(async (collections: Collection[]) => {
    if (!collections.length) {
      setCollections([]);
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
        setCollections([...result]);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      setCollections(result);
    } catch (error) {
      toast.error("Failed to process some collections");
    } finally {
      setLoadingCollections(false);
      setProcessingStatus("");
    }
  }, []);

  // Connect to socket.io
  useEffect(() => {
    const socket = io(baseUrl.replace(/\/api$/, ""));
    socket.on("collectionUpdate", () => {
      axios
        .get(baseUrl + "/collections/owners")
        .then((res) => processCollections(res.data))
        .catch(() => toast.error("Error fetching collections (realtime)"));
    });
    return () => {
      socket.disconnect();
    };
  }, [processCollections]);

  return (
    <div className="min-h-[200px]">
      {loadingCollections && (
        <div className="mb-4 flex w-full animate-pulse justify-center text-sm font-medium text-gray-500">
          <Loading
            text={
              collections.length > 0
                ? `Loading more collections... ${processingStatus}`
                : "Searching for available collections..."
            }
          />
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
