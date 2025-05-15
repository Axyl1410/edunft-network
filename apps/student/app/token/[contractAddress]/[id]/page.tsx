import BuyListingButton from "@/components/nft/buy-listing-button";
import Events from "@/components/nft/events";
import { MARKETPLACE, thirdwebClientPublic } from "@/lib/thirdweb";
import { formatAddress } from "@/lib/utils";
import getThirdwebContract from "@/services/get-contract";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getNFT } from "thirdweb/extensions/erc721";
import { getAllValidListings } from "thirdweb/extensions/marketplace";
import { Blobbie, MediaRenderer } from "thirdweb/react";
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ contractAddress: string; id: string }>;
}) {
  const { contractAddress, id } = await params;
  const contract = getThirdwebContract(contractAddress);

  if (!contract) notFound();

  const listingsPromise = getAllValidListings({
    contract: MARKETPLACE,
  });

  const nftPromise = getNFT({
    contract: contract,
    tokenId: BigInt(id),
    includeOwner: true,
  });

  const [listings, nft] = await Promise.all([listingsPromise, nftPromise]);

  if (!nft.tokenURI) notFound();

  if (nft.owner === null) {
    nft.owner = "0x";
  }

  const directListing = listings?.find(
    (l) =>
      l.assetContractAddress === contractAddress && l.tokenId === BigInt(id),
  );

  return (
    <div className="mx-auto my-4 flex max-w-5xl flex-col gap-8 px-2 md:flex-row md:gap-12">
      {/* Left: NFT Image & Info */}
      <div className="flex flex-1 flex-col items-center md:items-start">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white/[.04] dark:border-white/10">
          <MediaRenderer
            src={nft.metadata.image}
            client={thirdwebClientPublic}
            className="aspect-square w-full object-cover object-center"
          />
        </div>
        <div className="mt-6 flex w-full max-w-md flex-col gap-2">
          <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-white">
            {nft.metadata.name}
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Token ID: <span className="font-mono">#{nft.id.toString()}</span>
          </p>
        </div>
        <div className="mt-4 flex w-full max-w-md items-center gap-3">
          <Blobbie
            address={nft.owner}
            className="h-10 w-10 rounded-full border border-gray-300 dark:border-white/20"
          />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Current Owner
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatAddress(nft.owner)}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Price, Actions & History */}
      <div className="w-full flex-shrink-0 md:w-[370px] lg:w-[420px]">
        <div className="sticky top-8 flex flex-col gap-6">
          <div className="rounded-xl border border-gray-200 bg-white/[.04] p-6 dark:border-white/10">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-700 dark:text-white">
                Price:
              </span>
              {directListing ? (
                <span className="text-lg font-bold text-sky-600 dark:text-sky-400">
                  {directListing?.currencyValuePerToken.displayValue}
                  <span className="ml-1 uppercase">
                    {directListing?.currencyValuePerToken.symbol}
                  </span>
                </span>
              ) : (
                <span className="font-medium text-gray-400 dark:text-gray-500">
                  Not for sale
                </span>
              )}
            </div>
            <BuyListingButton
              directListing={directListing}
              contractAddress={contractAddress}
              tokenId={id.toString()}
            />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white/[.04] p-6 dark:border-white/10">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              History
            </h3>
            <div className="rounded-md border border-gray-100 bg-white/[.03] p-3 dark:border-white/10">
              <Suspense fallback={<div>Loading history...</div>}>
                <Events tokenId={nft.id} address={contractAddress} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
