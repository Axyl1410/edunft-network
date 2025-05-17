"use client";

import { MARKETPLACE } from "@/lib/thirdweb";
import CheckNFTListing from "@/services/check-nft-listing";
import getThirdwebContract from "@/services/get-contract";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import Loading from "@workspace/ui/components/loading";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { NFT as NFTType } from "thirdweb";
import { isApprovedForAll } from "thirdweb/extensions/erc721";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import ApprovalButton from "./approve-button";
import DirectListingButton from "./direct-listing-button";

type Props = {
  nft: NFTType;
  address: string;
};

export default function SaleInfo({ nft, address }: Props) {
  const account = useActiveAccount();
  const [tab, setTab] = useState<"direct">("direct");
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
    <>
      <div className="mb-6 flex w-full justify-start border-b dark:border-white/60">
        <h3
          className={cn(
            "flex h-12 cursor-pointer items-center justify-center px-4 text-base font-semibold transition-all hover:text-gray-700 dark:hover:text-white/80",
            tab === "direct" && "border-b-2 border-[#0294fe] text-[#0294fe]",
          )}
          onClick={() => setTab("direct")}
        >
          Direct
        </h3>
      </div>

      <motion.div layout style={{ height: "auto" }}>
        {/* Direct listing fields */}
        <div className={cn(tab === "direct" ? "flex" : "hidden", "flex-col")}>
          {/* Input field for buyout price */}
          <Label>Price per token</Label>

          <Input
            type="number"
            step={0.1}
            min="0"
            value={directListingState.price}
            onChange={(e) => setDirectListingState({ price: e.target.value })}
            className="my-4"
          />
          {!hasApproval ? (
            <ApprovalButton contract={contract} />
          ) : listingStatus.isSell ? null : (
            <DirectListingButton
              nft={nft}
              pricePerToken={directListingState.price}
              address={address}
            />
          )}
        </div>
      </motion.div>
    </>
  );
}
