import Events from "@/components/nft/events";
import { thirdwebClient } from "@/lib/thirdweb";
import { formatAddress } from "@/lib/utils";
import getThirdwebContract from "@/services/get-contract";
import { Badge } from "lucide-react";
import { notFound } from "next/navigation";
import { getNFT } from "thirdweb/extensions/erc721";
import { MediaRenderer } from "thirdweb/react";

type Attribute = {
  trait_type: string;
  value: string;
};

export default async function Page({
  params,
}: {
  params: Promise<{ contractAddress: string; id: string }>;
}) {
  const { contractAddress, id } = await params;
  const contract = getThirdwebContract(contractAddress);

  const nftPromise = getNFT({
    contract: contract,
    tokenId: BigInt(id),
    includeOwner: true,
  });

  const [nft] = await Promise.all([nftPromise]);

  if (!nft.tokenURI) notFound();

  return (
    <div className="mt-4 flex max-w-full flex-col gap-8 sm:flex-row">
      <div className="flex w-full flex-col">
        <MediaRenderer
          client={thirdwebClient}
          src={nft.metadata.image}
          className="!h-auto !w-full rounded-lg bg-white/[.04]"
        />
      </div>

      <div className="relative top-0 w-full max-w-full">
        <h1 className="mb-1 break-words text-3xl font-semibold">
          {nft.metadata.name}
        </h1>
        <p className="mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {nft.metadata.description}
        </p>
        <p className="mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          #{nft.id.toString()}
        </p>
        <div className="mt-1 flex gap-2">
          {nft.metadata.attributes &&
            (nft.metadata.attributes as unknown as Attribute[]).map(
              (attr: Attribute, index: number) => (
                <Badge key={index}>
                  {attr.trait_type} : {attr.value}
                </Badge>
              ),
            )}
        </div>
        <div className="mt-2 flex flex-col border-t pt-2">
          <h1 className="text-lg">history</h1>
          <Events tokenId={nft.id} address={contractAddress} />
        </div>
        <div className="mt-2 flex flex-col border-t pt-2">
          <span> Owner: </span>
          <p className="text-text font-medium dark:text-white/90">
            {nft.owner ? formatAddress(nft.owner) : "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
