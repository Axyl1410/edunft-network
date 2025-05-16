import { MARKETPLACE } from "@/lib/thirdweb";
import { toast } from "sonner";
import { getAllValidListings } from "thirdweb/extensions/marketplace";

let cachedListingSet: Set<string> | null = null;
let lastFetchTime = 0;
let fetchPromise: Promise<void> | null = null;
const CACHE_TTL = 60 * 1000; // 1 minute

async function ensureListingCache() {
  const now = Date.now();
  if (cachedListingSet && now - lastFetchTime < CACHE_TTL) {
    return;
  }
  if (fetchPromise) {
    return fetchPromise;
  }
  fetchPromise = (async () => {
    try {
      const listings = await getAllValidListings({ contract: MARKETPLACE });
      cachedListingSet = new Set(
        listings.map((l) => l.assetContractAddress.toLowerCase()),
      );
      lastFetchTime = Date.now();
    } catch (error) {
      toast.error("Error fetching marketplace listings", {
        description: (error as Error).message,
      });
      cachedListingSet = new Set();
    } finally {
      fetchPromise = null;
    }
  })();
  return fetchPromise;
}

export async function checkCollectionHasNFTs(
  collection: string,
): Promise<boolean> {
  await ensureListingCache();
  if (!cachedListingSet) return false;
  return cachedListingSet.has(collection.toLowerCase());
}
