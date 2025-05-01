import {
  createThirdwebClient,
  defineChain,
  getContract,
  type Chain,
} from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

if (!clientId) {
  throw new Error("No client ID provided");
}

const marketplace_address = "0x4f3b1c5a2d7e8c6f9e3b8a5d4f2b7c5e4f3b1c5a"; // mock address

export const thirdwebClient = createThirdwebClient(
  secretKey ? { secretKey } : { clientId },
);

export const FORMA_SKETCHPAD: Chain = defineChain({
  id: 984123,
  name: "Forma Sketchpad",
  nativeCurrency: {
    name: "TIA",
    symbol: "TIA",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sketchpad-1.forma.art"],
    },
  },
  blockExplorers: {
    default: {
      name: "FormaScan",
      url: "https://explorer.sketchpad-1.forma.art/",
    },
  },
  testnet: true,
});

export const MARKETPLACE = getContract({
  client: thirdwebClient,
  chain: FORMA_SKETCHPAD,
  address: marketplace_address,
});
