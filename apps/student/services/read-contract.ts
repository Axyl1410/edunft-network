import { readContract } from "thirdweb";
import getThirdwebContract from "./get-contract";

export async function readCollectionOwner(
  contractAddress: string,
): Promise<string> {
  const contract = getThirdwebContract(contractAddress);

  const data = await readContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  return data;
}
