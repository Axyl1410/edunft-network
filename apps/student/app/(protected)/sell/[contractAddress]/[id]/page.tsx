import SaleInfo from "@/components/nft/sale-info";
import { thirdwebClientPublic } from "@/lib/thirdweb";
import getThirdwebContract from "@/services/get-contract";
import { Badge } from "@workspace/ui/components/badge";
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
    <>
      <div className="mt-4 flex max-w-full flex-col gap-8 sm:flex-row">
        <div className="flex w-full flex-col">
          <MediaRenderer
            client={thirdwebClientPublic}
            src={nft.metadata.image}
            className="!h-auto !w-full rounded-lg bg-white/[.04]"
          />
        </div>

        <div className="relative top-0 w-full max-w-full">
          <h1 className="mb-1 break-words text-3xl font-semibold">
            {nft.metadata.name}
          </h1>
          {nft.metadata.external_url && (
            <div className="mb-2 inline-block w-fit rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
              📎 File attached
            </div>
          )}
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
          <SaleInfo address={contractAddress} nft={nft} />
        </div>
      </div>
    </>
  );
}
