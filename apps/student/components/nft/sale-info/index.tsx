"use client";

import { MARKETPLACE } from "@/lib/thirdweb";
import CheckNFTListing from "@/services/check-nft-listing";
import getThirdwebContract from "@/services/get-contract";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import Loading from "@workspace/ui/components/loading";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { NFT as NFTType } from "thirdweb";
import { isApprovedForAll } from "thirdweb/extensions/erc721";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import ApprovalButton from "./approve-button";
import CancelButton from "./cancel-button";
import DirectListingButton from "./direct-listing-button";

type Props = {
  nft: NFTType;
  address: string;
};

export default function SaleInfo({ nft, address }: Props) {
  const account = useActiveAccount();
  const [loading, setLoading] = useState(true);

  const contract = getThirdwebContract(address);
  if (!contract) notFound();

  const { data: hasApproval } = useReadContract(isApprovedForAll, {
    contract: contract,
    owner: (account?.address as string) || "0x",
    operator: MARKETPLACE.address,
  });

  const listingStatus = CheckNFTListing({
    contractAddress: address,
    tokenId: nft.id.toString(),
  });

  const [directListingState, setDirectListingState] = useState({
    price: "0",
  });

  useEffect(() => {
    if (hasApproval !== undefined && !listingStatus.isLoading)
      setLoading(false);
  }, [hasApproval, listingStatus]);

  if (!account) return null;

  if (loading) return <Loading />;

  return (
    <Card className="w-full border bg-white/80 p-4 shadow-sm dark:bg-neutral-900">
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="mb-2 flex items-center gap-2 border-b pb-2 dark:border-white/20">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Sell NFT
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Price per token
          </Label>
          <Input
            type="number"
            step={0.000001}
            min="0"
            value={directListingState.price}
            onChange={(e) => setDirectListingState({ price: e.target.value })}
            className="my-1 max-w-xs rounded border px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none dark:bg-neutral-800 dark:text-white"
            placeholder="Enter price"
          />
        </div>
        <div className="mt-2 flex flex-row gap-2">
          {!hasApproval ? (
            <ApprovalButton contract={contract} />
          ) : listingStatus.isSell ? (
            <CancelButton id={listingStatus.listingId} />
          ) : (
            <DirectListingButton
              nft={nft}
              pricePerToken={directListingState.price}
              address={address}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
