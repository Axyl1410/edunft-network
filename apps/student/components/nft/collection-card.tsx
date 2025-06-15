import { thirdwebClient } from "@/lib/thirdweb";
import getThirdwebContract from "@/services/get-contract";
import { Card, CardContent } from "@workspace/ui/components/card";
import { motion } from "motion/react";
import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import { MediaRenderer, useReadContract } from "thirdweb/react";

type CollectionCardProps = {
  address: string;
  showTotal?: boolean;
  [x: string]: unknown;
};

const CollectionCard: React.FC<CollectionCardProps> = ({
  address,
  showTotal = true,
  ...props
}) => {
  const contract = getThirdwebContract(address);
  if (!contract) notFound();

  const { data: metadata } = useReadContract(getContractMetadata, {
    contract: contract,
    queryOptions: {
      enabled: !!contract,
    },
  });

  const { data, isPending } = useReadContract({
    contract,
    method: "function totalSupply() view returns (uint256)",
    params: [],
  });

  return (
    <Card
      className="bg-secondary flex w-full flex-col items-center gap-3 rounded-lg border px-1 py-3 transition-colors hover:border-blue-400"
      {...props}
    >
      <CardContent className="flex w-full flex-col items-center gap-3 p-2">
        <motion.div
          className="flex w-full justify-center"
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {metadata?.image ? (
            <MediaRenderer
              src={metadata.image}
              alt={metadata.name}
              client={thirdwebClient}
              className="aspect-square rounded-md object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-md bg-gray-200">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </motion.div>
        <div className="flex w-full flex-col px-2">
          <span className="text-md truncate font-bold">{metadata?.name}</span>
          <span className="mb-1 text-sm">
            {`Symbol: ${metadata?.symbol || "N/A"}`}
          </span>
          {metadata?.external_url && (
            <a
              href={metadata.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 w-fit rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 hover:underline"
            >
              📎 File attached
            </a>
          )}
          {showTotal && (
            <span className="text-sm">
              {`Total NFTs: ${isPending ? "Loading..." : data ? data.toString() : "N/A"}`}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionCard;
