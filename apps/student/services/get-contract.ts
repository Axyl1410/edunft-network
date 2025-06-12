import { FORMA_SKETCHPAD } from "@/constant";
import { thirdwebClient } from "@/lib/thirdweb";
import { getContract } from "thirdweb";

const getThirdwebContract = (address: string) => {
  return (
    getContract({
      client: thirdwebClient,
      address: address,
      chain: FORMA_SKETCHPAD,
    }) ?? null
  );
};

export default getThirdwebContract;
