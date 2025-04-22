import { POLYGON_ZKEVM_CHAIN, thirdwebClient } from "@/lib/thirdweb-client";
import { getContract } from "thirdweb";

const getThirdwebContract = (address: string) => {
  return (
    getContract({
      client: thirdwebClient,
      address: address,
      chain: POLYGON_ZKEVM_CHAIN,
    }) ?? null
  );
};

export default getThirdwebContract;
