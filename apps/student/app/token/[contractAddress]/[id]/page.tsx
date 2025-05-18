import BackButton from "@/components/layout/back-button";
import BuyListingButton from "@/components/nft/buy-listing-button";
import Events from "@/components/nft/events";
import { baseUrl } from "@/lib/client";
import { MARKETPLACE, thirdwebClientPublic } from "@/lib/thirdweb";
import { formatAddress } from "@/lib/utils";
import getThirdwebContract from "@/services/get-contract";
import Loading from "@workspace/ui/components/loading";
import axios from "axios";
import { Clock, ExternalLink, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getNFT } from "thirdweb/extensions/erc721";
import { getAllValidListings } from "thirdweb/extensions/marketplace";
import { Blobbie, MediaRenderer } from "thirdweb/react";
import { FileActions } from "./FileActions";

export const dynamic = "force-dynamic";

const OwnerAvatar = async ({ address }: { address: string }) => {
  try {
    // Fetch user avatar from API
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

  // Fallback to Blobbie if avatar not found or error occurred
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

  // Extract attributes if they exist
  const attributes = nft.metadata.attributes || [];

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb Navigation */}
      <div className="mb-2">
        <BackButton variant="outline" className="cursor-pointer" />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column: Image & Attributes */}
        <div className="w-full lg:sticky lg:top-4 lg:h-max lg:w-1/2">
          <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl dark:bg-gray-900">
            {/* NFT Image with overlay status */}
            <div className="relative">
              <div className="aspect-square w-full overflow-hidden">
                <MediaRenderer
                  src={nft.metadata.image}
                  client={thirdwebClientPublic}
                  className="h-full w-full object-contain"
                />
              </div>

              {directListing && (
                <div className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-white shadow-md">
                  For Sale
                </div>
              )}
            </div>

            {/* Properties/Attributes */}
            {attributes &&
              Array.isArray(attributes) &&
              attributes.length > 0 && (
                <div className="border-t border-gray-100 p-6 dark:border-gray-800">
                  <h3 className="mb-4 flex items-center text-lg font-bold">
                    <Tag className="mr-2 h-5 w-5 text-gray-500" /> Properties
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {Array.isArray(attributes) &&
                      attributes.map((attr: any, index: number) => (
                        <div
                          key={index}
                          className="rounded-lg bg-gray-50 p-3 text-center transition-all hover:translate-y-[-2px] dark:bg-gray-800"
                        >
                          <p className="mb-1 text-xs font-medium uppercase text-blue-500 dark:text-blue-400">
                            {attr.trait_type}
                          </p>
                          <p className="truncate font-medium text-gray-900 dark:text-white">
                            {attr.value?.toString() || "-"}
                          </p>
                          {attr.max_value && (
                            <p className="mt-1 text-xs text-gray-500">
                              {typeof attr.max_value === "number"
                                ? `${Math.round((Number(attr.value || 0) / Number(attr.max_value)) * 100)}%`
                                : attr.max_value}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Right column: Details & Actions */}
        <div className="flex-1 space-y-6">
          {/* NFT Details */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">
                  {nft.metadata.name}
                </h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Token ID:{" "}
                  <span className="font-mono">#{nft.id.toString()}</span>
                </p>
              </div>

              <Link
                href={`/collection/${contractAddress}`}
                className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              >
                View Collection <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </div>

            {/* Owner Info */}
            <div className="mb-6 mt-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <Suspense
                fallback={
                  <Blobbie
                    address={nft.owner}
                    className="h-12 w-12 rounded-full border border-gray-300 dark:border-white/20"
                  />
                }
              >
                <OwnerAvatar address={nft.owner} />
              </Suspense>
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Current Owner
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatAddress(nft.owner)}
                </span>
              </div>
            </div>

            {/* Description */}
            {nft.metadata.description && (
              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold">Description</h2>
                <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                  {nft.metadata.description}
                </p>
              </div>
            )}

            {nft.metadata.external_url && (
              <FileActions
                externalUrl={nft.metadata.external_url}
                owner={nft.owner}
              />
            )}
          </div>

          {/* Price and Buy Section */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Listing Details</h2>
              {directListing && (
                <div className="rounded-lg bg-green-50 px-3 py-1 font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Active Listing
                </div>
              )}
            </div>

            {directListing ? (
              <>
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                  <span>Price:</span>
                  <span className="text-2xl font-bold text-black dark:text-white">
                    {directListing?.currencyValuePerToken.displayValue}
                    <span className="ml-1 uppercase">
                      {directListing?.currencyValuePerToken.symbol}
                    </span>
                  </span>
                </div>
                <div className="mt-5">
                  <BuyListingButton
                    directListing={directListing}
                    contractAddress={contractAddress}
                    tokenId={id.toString()}
                  />
                </div>
              </>
            ) : (
              <div className="rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800">
                <p className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  Not For Sale
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This NFT is not currently listed for sale.
                </p>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900">
            <h2 className="mb-4 flex items-center text-lg font-semibold">
              <Clock className="mr-2 h-5 w-5 text-gray-500" />
              Transaction History
            </h2>
            <div className="rounded-lg">
              <Suspense fallback={<Loading text="Loading history..." />}>
                <Events tokenId={nft.id} address={contractAddress} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
