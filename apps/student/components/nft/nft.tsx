"use client";

import getThirdwebContract from "@/services/get-contract";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { NFT } from "thirdweb";
import { getNFT } from "thirdweb/extensions/erc721";
import { DirectListing } from "thirdweb/extensions/marketplace";
import { NFTDescription, NFTMedia, NFTName, NFTProvider } from "thirdweb/react";

type Props = {
  tokenId: bigint;
  nft?: NFT;
  directListing?: DirectListing;
  address: string;
};

export default function NFTComponent({
  tokenId,
  directListing,
  address,
  ...props
}: Props) {
  const [nft, setNFT] = useState(props.nft);
  const contract = getThirdwebContract(address);

  if (!contract) notFound();

  useEffect(() => {
    if (nft?.id !== tokenId) {
      getNFT({
        contract: contract,
        tokenId: tokenId,
        includeOwner: true,
      }).then((nft) => {
        setNFT(nft);
      });
    }
  }, [tokenId, nft?.id, contract]);

  if (!nft) return <LoadingNFTComponent />;

  return (
    <a href={`/token/${address}/${tokenId.toString()}`}>
      <NFTProvider tokenId={tokenId} contract={contract}>
        <div className="bg-accent flex flex-col gap-1.5 rounded-lg border px-1 py-3 hover:border-sky-400">
          <NFTMedia className="rounded-md px-2 text-center" />
          <NFTName className="px-2 font-bold" />
          <NFTDescription
            className="px-2 text-sm"
            loadingComponent={<span>Loading...</span>}
          />
          <div className="flex items-center justify-between px-2">
            <div>#{tokenId.toString()}</div>
            {directListing && (
              <div className="flex flex-col items-center justify-center">
                <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium dark:text-white/60">
                  Price
                </p>
                <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap dark:text-white">
                  {`${directListing?.currencyValuePerToken.displayValue}${directListing?.currencyValuePerToken.symbol}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </NFTProvider>
    </a>
  );
}

export function LoadingNFTComponent() {
  return (
    <div className="h-[350px] w-full rounded-lg">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
