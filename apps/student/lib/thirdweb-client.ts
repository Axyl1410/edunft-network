import { createThirdwebClient, getContract } from "thirdweb";
import { polygonZkEvmCardona } from "viem/chains";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

if (!clientId) {
  throw new Error("No client ID provided");
}

const marketplace_address = "0x4f3b1c5a2d7e8c6f9e3b8a5d4f2b7c5e4f3b1c5a"; // mock address

export const thirdwebClient = createThirdwebClient(
  secretKey ? { secretKey } : { clientId },
);

export const POLYGON_ZKEVM_CHAIN = {
  ...polygonZkEvmCardona,
  rpc: polygonZkEvmCardona.rpcUrls.default.http[0],
  blockExplorers: [
    {
      name: polygonZkEvmCardona.blockExplorers.default.name,
      url: polygonZkEvmCardona.blockExplorers.default.url,
      apiUrl: polygonZkEvmCardona.blockExplorers.default.apiUrl,
    },
  ],
};

export const MARKETPLACE = getContract({
  client: thirdwebClient,
  chain: POLYGON_ZKEVM_CHAIN,
  address: marketplace_address,
});
