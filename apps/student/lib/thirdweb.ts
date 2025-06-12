import { FORMA_SKETCHPAD, marketplace_address } from "@/constant";
import { createThirdwebClient, getContract } from "thirdweb";
import { assertValue } from "./utils";

const clientId = assertValue(
  process.env.NEXT_PUBLIC_CLIENT_ID,
  "No client ID provided",
);
const secretKey = process.env.TW_SECRET_KEY;

export const thirdwebClient = createThirdwebClient(
  secretKey ? { secretKey } : { clientId },
);

export const thirdwebClientPublic = createThirdwebClient({ clientId });

export const MARKETPLACE = getContract({
  client: thirdwebClient,
  chain: FORMA_SKETCHPAD,
  address: marketplace_address,
});
