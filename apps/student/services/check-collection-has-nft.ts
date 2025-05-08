import { MARKETPLACE } from "@/lib/thirdweb-client";
import { toast } from "sonner";
import {
  DirectListing,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";

type Collection = {
  listings: DirectListing[];
};

const cache = new Map<string, Collection>();

async function fetchListings(collection: string) {
  const listings = await getAllValidListings({ contract: MARKETPLACE });
  return listings.filter(
    (listing) => listing.assetContractAddress === collection,
  );
}

export async function checkCollectionHasNFTs(
  collection: string,
): Promise<boolean> {
  if (cache.has(collection)) {
    const { listings } = cache.get(collection)!;
    return listings.length > 0;
  }

  try {
    const listings = await fetchListings(collection);

    cache.set(collection, { listings });

    return listings.length > 0;
  } catch (error) {
    toast.error("Error fetching data:", {
      description: error as string,
    });
    return false;
  }
}
