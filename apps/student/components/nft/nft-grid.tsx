import type { NFT as NFTType } from "thirdweb";
import { DirectListing } from "thirdweb/extensions/marketplace";
import NFT, { LoadingNFTComponent } from "./nft";

type Props = {
  nftData: {
    tokenId: bigint;
    nft?: NFTType;
    directListing?: DirectListing;
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
