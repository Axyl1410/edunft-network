import { Chain, defineChain } from "thirdweb";

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

export const FORMASCAN_URL = "https://explorer.sketchpad-1.forma.art";

export const marketplace_address = "0xa7d2c8d1Fd78cc65aaC5DBCfd91A4B7190acf89A";
