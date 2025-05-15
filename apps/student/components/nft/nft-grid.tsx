import { Skeleton } from "@workspace/ui/components/skeleton";
import type { NFT as NFTType } from "thirdweb";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";
import NFT from "./nft";

type Props = {
  nftData: {
    tokenId: bigint;
    nft?: NFTType;
    directListing?: DirectListing;
    auctionListing?: EnglishAuction;
  }[];
  address: string;
};

export function NFTGridLoading() {
  return (
    <div className="grid grid-cols-2 place-items-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {[...Array(12)].map((_, index) => (
        <LoadingNFTComponent key={index} />
      ))}
    </div>
  );
}

export function LoadingNFTComponent() {
  return (
    <div className="h-[350px] w-full rounded-lg">
      <Skeleton className="h-full w-full" />
    </div>
  );
}

export default function NFTGrid({ nftData, address }: Props) {
  if (nftData && nftData.length > 0) {
    return (
      <>
        {nftData.map((nft) => (
          <NFT key={nft.tokenId} {...nft} address={address} />
        ))}
      </>
    );
  }
}
