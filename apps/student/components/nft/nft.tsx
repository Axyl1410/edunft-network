"use client";

import getThirdwebContract from "@/services/get-contract";
import Loading from "@workspace/ui/components/loading";
import Link from "next/link";
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
    <Link href={`/token/${address}/${tokenId.toString()}`}>
      <NFTProvider tokenId={tokenId} contract={contract}>
        <div className="bg-accent flex flex-col gap-1.5 rounded-lg border px-1 py-3 hover:border-sky-400">
          <div className="flex w-full justify-center">
            <NFTMedia className="aspect-square h-[200px] w-[200px] rounded-md object-cover px-2 text-center" />
          </div>
          <NFTName className="max-w-[200px] truncate px-2 font-bold" />
          <NFTDescription
            className="px-2 text-sm"
            loadingComponent={<Loading />}
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
    </Link>
  );
}

export function LoadingNFTComponent() {
  return (
    <div className="bg-accent flex w-[230px] animate-pulse flex-col gap-1.5 rounded-lg border px-1 py-3">
      <div className="mb-2 h-40 w-full rounded-md bg-gray-200 dark:bg-neutral-700" />
      <div className="mx-2 mb-1 h-5 w-3/4 rounded bg-gray-200 dark:bg-neutral-700" />
      <div className="mx-2 mb-2 h-4 w-full rounded bg-gray-200 dark:bg-neutral-700" />
      <div className="mt-2 flex items-center justify-between px-2">
        <div className="h-4 w-10 rounded bg-gray-200 dark:bg-neutral-700" />
        <div className="flex flex-col items-center">
          <div className="mb-1 h-3 w-8 rounded bg-gray-200 dark:bg-neutral-700" />
          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-neutral-700" />
        </div>
      </div>
    </div>
  );
}
