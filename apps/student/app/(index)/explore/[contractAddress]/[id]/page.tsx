import BackButton from "@/components/common/back-button";
import Events from "@/components/nft/events";
import { baseUrl } from "@/lib/client";
import { thirdwebClientPublic } from "@/lib/thirdweb";
import { formatAddress } from "@/lib/utils";
import getThirdwebContract from "@/services/get-contract";
import { Attribute } from "@/types";
import axios from "axios";
import { Badge } from "lucide-react";
import { notFound } from "next/navigation";
import { getNFT } from "thirdweb/extensions/erc721";
import { Blobbie, MediaRenderer } from "thirdweb/react";

const OwnerAvatar = async ({ address }: { address: string }) => {
  try {
    const response = await axios.get(`${baseUrl}/user/${address}/avatar`);
    if (response.status === 200) {
      const data = response.data;
      if (data.avatar) {
        return (
          <img
            src={data.avatar}
            alt={`Owner: ${formatAddress(address)}`}
            width={40}
            height={40}
            style={{ borderRadius: "50%", border: "1px solid #ccc" }}
            className="h-10 w-10 rounded-full border border-gray-300 dark:border-white/20"
          />
        );
      }
    }
  } catch (error) {
    console.error("Failed to fetch user avatar:", error);
  }
  return (
    <Blobbie
      address={address}
      className="h-10 w-10 rounded-full border border-gray-300 dark:border-white/20"
    />
  );
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
          client={thirdwebClientPublic}
          src={nft.metadata.image}
          className="!h-auto !w-full rounded-lg bg-white/[.04]"
        />
      </div>

      <div className="relative top-0 w-full max-w-full">
        <div className="mb-2 flex w-full justify-end">
          <BackButton className="cursor-pointer" variant={"ghost"} />
        </div>
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
          <div className="mt-1 flex items-center gap-3">
            <OwnerAvatar address={nft.owner ?? ""} />
            <p className="text-text font-medium dark:text-white/90">
              {nft.owner ? formatAddress(nft.owner) : "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
