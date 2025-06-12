"use client";

import ListingGrid from "@/components/nft/listing-grid";

export function GetItem({ address }: { address: string }) {
  return <ListingGrid collection={address} />;
}
