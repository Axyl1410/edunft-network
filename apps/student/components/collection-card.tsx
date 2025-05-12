import { thirdwebClient } from "@/lib/thirdweb-client";
import getThirdwebContract from "@/services/get-contract";
import { Card, CardContent } from "@workspace/ui/components/card";
import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import { MediaRenderer, useReadContract } from "thirdweb/react";

type CollectionCardProps = {
  address: string;
  [x: string]: unknown;
};

const CollectionCard: React.FC<CollectionCardProps> = ({
  address,
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

  return (
    <Card
      className="bg-secondary flex w-full flex-col gap-3 rounded-lg border px-1 py-3 data-[state=open]:w-[230px]"
      {...props}
    >
      <CardContent className="flex flex-col items-center gap-3 p-2">
        <div className="flex w-full justify-center">
          {metadata?.image ? (
            <MediaRenderer
              src={metadata.image}
              alt={metadata.name}
              client={thirdwebClient}
              className="aspect-square rounded-md object-cover"
            />
          ) : (
            <div className="flex h-[200px] w-[200px] items-center justify-center rounded-md bg-gray-200">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div className="flex w-full flex-col px-2">
          <span className="w-full truncate text-lg font-bold">
            {metadata?.name}
          </span>
          <span className="mb-1 text-sm">
            {`Symbol: ${metadata?.symbol || "N/A"}`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionCard;
