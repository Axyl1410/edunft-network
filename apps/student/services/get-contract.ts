import { FORMA_SKETCHPAD, thirdwebClient } from "@/lib/thirdweb-client";
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
