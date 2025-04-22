import { MARKETPLACE } from "@/lib/thirdweb-client";
import { toast } from "sonner";
import {
  DirectListing,
  EnglishAuction,
  getAllValidAuctions,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";

type Collection = {
  listings: DirectListing[];
  auctions: EnglishAuction[];
};

const cache = new Map<string, Collection>();

async function fetchListings(collection: string) {
  const listings = await getAllValidListings({ contract: MARKETPLACE });
  return listings.filter(
    (listing) => listing.assetContractAddress === collection,
  );
}

async function fetchAuctions(collection: string) {
  const auctions = await getAllValidAuctions({ contract: MARKETPLACE });
  return auctions.filter(
    (auction) => auction.assetContractAddress === collection,
  );
}

export async function checkCollectionHasNFTs(
  collection: string,
): Promise<boolean> {
  if (cache.has(collection)) {
    const { listings, auctions } = cache.get(collection)!;
    return listings.length > 0 || auctions.length > 0;
  }

  try {
    const [listings, auctions] = await Promise.all([
      fetchListings(collection),
      fetchAuctions(collection),
    ]);

    cache.set(collection, { listings, auctions });

    return listings.length > 0 || auctions.length > 0;
  } catch (error) {
    toast.error("Error fetching data:", {
      description: error as string,
    });
    return false;
  }
}
