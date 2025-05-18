"use client";

import NFTGrid, { NFTGridLoading } from "@/components/nft/nft-grid";
import { MARKETPLACE } from "@/lib/thirdweb";
import React, { useEffect, useState } from "react";
import { NFT as NFTType } from "thirdweb";
import {
  DirectListing,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";

type Props = {
  collection: string;
};

interface NFTData {
  tokenId: bigint;
  nft?: NFTType;
  directListing?: DirectListing;
}

const ListingGrid: React.FC<Props> = (props) => {
  const [nftData, setNftData] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = React.useCallback(async () => {
    const listings = await getAllValidListings({
      contract: MARKETPLACE,
    });

    // Retrieve all NFTs from the listings
    const tokenIds = Array.from(
      new Set([
        ...listings
          .filter((l) => l.assetContractAddress === props.collection)
          .map((l) => l.tokenId),
      ]),
    );

    const nftData = tokenIds.map((tokenId) => {
      return {
        tokenId: tokenId,
        directListing: listings.find((listing) => listing.tokenId === tokenId),
      };
    });

    setNftData(nftData);
    setLoading(false);
  }, [props.collection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return loading ? (
    <NFTGridLoading />
  ) : (
    <div className="grid grid-cols-2 place-items-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      <NFTGrid nftData={nftData} address={props.collection} />
    </div>
  );
};

export default ListingGrid;
