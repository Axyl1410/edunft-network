"use client";

import { MARKETPLACE } from "@/lib/thirdweb";
import { useEffect, useMemo, useState } from "react";
import { getAllValidListings } from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";

interface NFTListingStatus {
  isSell: boolean;
  listed: boolean;
  listingId?: bigint;
  isLoading: boolean;
}

interface CheckNFTListingProps {
  contractAddress: string;
  tokenId: string;
}

export default function CheckNFTListing({
  contractAddress,
  tokenId,
}: CheckNFTListingProps): NFTListingStatus {
  const [status, setStatus] = useState<NFTListingStatus>({
    isSell: false,
    listed: false,
    listingId: undefined,
    isLoading: true,
  });

  const { data: listings, isLoading: isListingsLoading } = useReadContract(
    getAllValidListings,
    { contract: MARKETPLACE },
  );

  const tokenIdBigInt = useMemo(() => BigInt(tokenId), [tokenId]);

  const activeListing = useMemo(() => {
    if (!listings || isListingsLoading) return undefined;

    return listings.find(
      (l) =>
        l.assetContractAddress === contractAddress &&
        l.tokenId === tokenIdBigInt &&
        l.status === "ACTIVE",
    );
  }, [listings, contractAddress, tokenIdBigInt, isListingsLoading]);

  const currentStatus = useMemo<NFTListingStatus>(
    () => ({
      listed: !!activeListing,
      isSell: !!activeListing,
      listingId: activeListing?.id,
      isLoading: isListingsLoading,
    }),
    [activeListing, isListingsLoading],
  );

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  return status;
}
