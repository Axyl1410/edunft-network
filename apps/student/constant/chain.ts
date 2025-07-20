import { Chain, defineChain } from "thirdweb";

export const FORMA_SKETCHPAD: Chain = defineChain({
	id: 4202,
	name: "Lisk Sepolia Testnet",
	nativeCurrency: {
		name: "ETH",
		symbol: "ETH",
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: ["https://rpc.sepolia-api.lisk.com"],
		},
	},
	blockExplorers: {
		default: {
			name: "Sepolia Blockscout",
			url: "https://sepolia-blockscout.lisk.com",
		},
	},
	testnet: true,
});

export const FORMASCAN_URL = "https://sepolia-blockscout.lisk.com";
