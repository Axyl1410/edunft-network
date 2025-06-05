import { thirdwebClient } from "@/lib/thirdweb";
import getThirdwebContract from "@/services/get-contract";
import { getCollectionTotal } from "@/services/get-event";
import { Card, CardContent } from "@workspace/ui/components/card";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
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

  const [total, setTotal] = useState<number | null>(null);
  useEffect(() => {
    let mounted = true;
    if (showTotal) {
      getCollectionTotal({ address }).then((res) => {
        if (mounted) setTotal(res);
      });
    } else {
      setTotal(null);
    }
    return () => {
      mounted = false;
    };
  }, [address, showTotal]);

  return (
    <Card
      className="bg-secondary flex w-full flex-col items-center gap-3 rounded-lg border px-1 py-3 transition-colors hover:border-blue-400"
      {...props}
    >
      <CardContent className="flex w-full flex-col items-center gap-3 p-2">
        <div className="flex w-full justify-center">
          {metadata?.image ? (
            <MediaRenderer
              src={metadata.image}
              alt={metadata.name}
              client={thirdwebClient}
              className="aspect-square rounded-md object-cover"
            />
          ) : (
            <div className="flex items-center justify-center rounded-md bg-gray-200">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
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
              {`Total: ${total === null ? "..." : total}`}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionCard;
