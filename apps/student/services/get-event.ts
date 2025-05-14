/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContractEvents, prepareEvent } from "thirdweb";
import getThirdwebContract from "./get-contract";

interface GetEventParams {
  tokenId: bigint;
  address: string;
}

export default async function getThirdwebEvent({
  tokenId,
  address,
}: GetEventParams): Promise<any[]> {
  const contract = getThirdwebContract(address);
  const events = await getContractEvents({
    contract,
    fromBlock: BigInt(1),
    events: [
      prepareEvent({
        signature:
          "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
        filters: { tokenId: tokenId.toString() },
      }),
    ],
  });

  return events.reverse();
}

interface GetCollectionTotalParams {
  address: string;
}

export async function getCollectionTotal({
  address,
}: GetCollectionTotalParams): Promise<number> {
  const contract = getThirdwebContract(address);
  // Lấy tất cả event Transfer (mint)
  const events = await getContractEvents({
    contract,
    fromBlock: BigInt(1),
    events: [
      prepareEvent({
        signature:
          "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
        // Lọc mint: from = 0x000...000
        filters: { from: "0x0000000000000000000000000000000000000000" },
      }),
    ],
  });
  // Count unique tokenIds
  const uniqueTokenIds = new Set(
    events.map((e) => (e.args as { tokenId: string }).tokenId),
  );
  return uniqueTokenIds.size;
}
