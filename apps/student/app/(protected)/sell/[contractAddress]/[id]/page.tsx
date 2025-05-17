import SaleInfo from "@/components/nft/sale-info";
import { thirdwebClientPublic } from "@/lib/thirdweb";
import getThirdwebContract from "@/services/get-contract";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
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
    <Card className="mt-6 flex w-full flex-col gap-8 border bg-white/80 p-6 shadow-sm sm:flex-row dark:bg-neutral-900">
      <CardContent className="flex w-full flex-col items-center justify-center p-0 sm:w-1/2">
        <MediaRenderer
          client={thirdwebClientPublic}
          src={nft.metadata.image}
          className="aspect-square w-full max-w-xs rounded-lg bg-gray-100 object-cover object-center dark:bg-neutral-800"
        />
      </CardContent>
      <CardContent className="flex w-full flex-1 flex-col justify-center gap-2 p-0 sm:pl-8">
        <h1 className="mb-1 break-words text-2xl font-bold text-gray-900 dark:text-white">
          {nft.metadata.name}
        </h1>
        {nft.metadata.external_url && (
          <div className="mb-2 inline-flex items-center gap-2 rounded bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <span className="text-lg">📎</span> File attached
          </div>
        )}
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
          {nft.metadata.description}
        </p>
        <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
          Token ID: #{nft.id.toString()}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {nft.metadata.attributes &&
            (nft.metadata.attributes as unknown as Attribute[]).map(
              (attr: Attribute, index: number) => (
                <Badge
                  key={index}
                  className="rounded px-2 py-1 text-xs font-medium"
                >
                  {attr.trait_type} : {attr.value}
                </Badge>
              ),
            )}
        </div>
        <div className="mt-4">
          <SaleInfo address={contractAddress} nft={nft} />
        </div>
      </CardContent>
    </Card>
  );
}
