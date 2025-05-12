"use client";

import CollectionCard from "@/components/collection-card";
import { NFTGridLoading } from "@/components/nft-grid";
import { baseUrl } from "@/lib/client";
import { checkCollectionHasNFTs } from "@/services/check-collection-has-nft";
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

  useEffect(() => {
    axios
      .get(baseUrl + "/collections/owners")
      .then((res) => {
        setCollections(res.data);
      })
      .catch((err) => {
        toast.error("Error fetching collections");
      });
  }, []);

  const [collectionsWithNFTs, setCollectionsWithNFTs] = useState<Collection[]>(
    [],
  );
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  const processCollections = useCallback(async (collections: Collection[]) => {
    if (!collections.length) return [];

    setLoadingCollections(true);
    const batchSize = 5;
    const result: Collection[] = [];
    const totalBatches = Math.ceil(collections.length / batchSize);

    try {
      for (let i = 0; i < collections.length; i += batchSize) {
        const currentBatch = Math.floor(i / batchSize) + 1;
        setProcessingStatus(`Processing batch ${currentBatch}/${totalBatches}`);

        const batch = collections.slice(i, i + batchSize);
        const batchPromises = batch.map(async (collection) => {
          try {
            const hasNFTs = await checkCollectionHasNFTs(collection.address);
            return hasNFTs ? collection : null;
          } catch (error) {
            console.error(`Error checking NFTs for ${collection.name}:`, error);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        const validCollections = batchResults.filter(Boolean) as Collection[];

        result.push(...validCollections);

        // Update state with full result set to avoid duplicates
        setCollectionsWithNFTs([...result]);

        // Small delay to avoid UI freezing
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      return result;
    } catch (error) {
      console.error("Error processing collections:", error);
      toast.error("Failed to process some collections");
      return result;
    } finally {
      setLoadingCollections(false);
      setProcessingStatus("");
    }
  }, []);

  useEffect(() => {
    if (!collections) return;

    // Reset collections when data changes
    setCollectionsWithNFTs([]);
    processCollections(collections);
  }, [collections, processCollections]);

  return (
    <div className="my-8">
      <Suspense fallback={<NFTGridLoading />}>
        <div className="min-h-[200px]">
          {loadingCollections && (
            <div className="mb-4 animate-pulse text-sm font-medium text-gray-500">
              {collectionsWithNFTs.length > 0
                ? `Loading more collections... ${processingStatus}`
                : "Searching for available collections..."}
            </div>
          )}

          {collectionsWithNFTs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {collectionsWithNFTs.map((collection: Collection) => (
                <Link
                  key={collection.address}
                  href={`/buy/${collection.address}`}
                  className="transition-transform hover:scale-[1.01]"
                >
                  <CollectionCard
                    address={collection.address}
                    name={collection.name}
                  />
                </Link>
              ))}
            </div>
          ) : (
            !loadingCollections && (
              <p className="text-sm font-bold">
                Looks like there are no listed NFTs in this collection. Check
                back later!
              </p>
            )
          )}

          {collectionsWithNFTs.length > 0 && !loadingCollections && (
            <div className="mt-8 grid w-full place-content-center">
              <p className="text-sm font-bold">End of listed for sale</p>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
}
