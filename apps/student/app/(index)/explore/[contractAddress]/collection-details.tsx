"use client";

import { FORMASCAN_URL } from "@/constant";
import { formatAddress } from "@/lib/utils";
import getThirdwebContract from "@/services/get-contract";
import { Button } from "@workspace/ui/components/button";
import { Copy, Edit, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { toast } from "sonner";
import { useActiveAccount, useReadContract } from "thirdweb/react";

interface CollectionDetailsProps {
  contractAddress: string;
}

export function CollectionDetails({ contractAddress }: CollectionDetailsProps) {
  const contract = getThirdwebContract(contractAddress);
  const account = useActiveAccount();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    toast.success("Address copied to clipboard");
  };

  const { data, isPending } = useReadContract({
    contract,
    method: "function nextTokenIdToMint() view returns (uint256)",
    params: [],
  });

  const { data: royaltyInfo, isPending: isRoyaltyInfoPending } =
    useReadContract({
      contract,
      method: "function getDefaultRoyaltyInfo() view returns (address, uint16)",
      params: [],
    });

  const { data: owner, isPending: isOwnerPending } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg border border-gray-500/50 p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Collection Details</h3>
        {account?.address === owner && !isOwnerPending && (
          <Link href={`/edit/${contractAddress}`}>
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-muted-foreground text-sm">Contract Address</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm">{contractAddress}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Link
              href={FORMASCAN_URL + `/token/${contractAddress}`}
              target="_blank"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 cursor-pointer"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Next Token ID to Mint</p>
          <p className="font-mono text-sm">
            {isPending ? "Loading..." : (data?.toString() ?? "-")}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Royalty Info</p>
          <p className="font-mono text-sm">
            {isRoyaltyInfoPending
              ? "Loading..."
              : royaltyInfo
                ? `${formatAddress(royaltyInfo[0])} (${royaltyInfo[1]}%)`
                : "-"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
