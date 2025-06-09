import { NFTGridLoading } from "@/components/nft/nft-grid";
import { baseUrl } from "@/lib/client";
import { checkCollectionHasNFTs } from "@/services/check-collection-has-nft";
import axios from "axios";
import { Metadata } from "next";
import { Suspense } from "react";
import { CollectionsGrid } from "./collections-grid";

export const metadata: Metadata = {
  title: "Buy NFTs | EduNFT",
  description: "Browse and buy NFTs from various collections on EduNFT",
};

export const dynamic = "force-dynamic";

interface Collection {
  address: string;
  name: string;
}

async function getCollections(): Promise<Collection[]> {
  try {
    const res = await axios.get(baseUrl + "/collections/owners");
    return res.data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

async function getCollectionsWithNFTs(
  collections: Collection[],
): Promise<Collection[]> {
  if (!collections.length) return [];

  const batchSize = 5;
  const result: Collection[] = [];

  for (let i = 0; i < collections.length; i += batchSize) {
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
  }

  return result;
}

export default async function Buy() {
  const collections = await getCollections();
  const collectionsWithNFTs = await getCollectionsWithNFTs(collections);

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
        <CollectionsGrid initialCollections={collectionsWithNFTs} />
      </Suspense>
    </div>
  );
}
