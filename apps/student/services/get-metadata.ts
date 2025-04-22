import { getContractMetadata } from "thirdweb/extensions/common";
import getThirdwebContract from "./get-contract";

const getMetadata = (address: string) => {
  const contract = getThirdwebContract(address);

  const metadata = getContractMetadata({
    contract: contract,
  });

  return metadata ?? null;
};

export default getMetadata;
