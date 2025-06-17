import BackButton from "@/components/common/back-button";
import getThirdwebContract from "@/services/get-contract";
import { notFound } from "next/navigation";
import { getNFT } from "thirdweb/extensions/erc721";
import { NFTDetails } from "./nft-details";
import { getOwnerAvatarData } from "./owner-avatar-data";

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

  const ownerAvatarUrl = nft.owner ? await getOwnerAvatarData(nft.owner) : null;

  return (
    <div className="pb-px">
      <div className="mb-4">
        <BackButton
          to={`/explore/${contractAddress}`}
          variant="ghost"
          className="mb-2"
        >
          Back to Collection
        </BackButton>
      </div>
      <NFTDetails
        nft={nft}
        contractAddress={contractAddress}
        ownerAvatarUrl={ownerAvatarUrl}
      />
    </div>
  );
}
