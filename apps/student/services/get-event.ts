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
