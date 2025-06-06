import { NFTGridLoading } from "@/components/nft/nft-grid";
import { Metadata } from "next";
import { Suspense } from "react";
import { SellCollectionsGrid } from "./sell-collections-grid";

export const metadata: Metadata = {
  title: "Sell NFTs | EduNFT",
  description: "List your NFTs for sale on EduNFT",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <Suspense fallback={<NFTGridLoading />}>
      <SellCollectionsGrid />
    </Suspense>
  );
}
