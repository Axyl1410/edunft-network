import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

if (!clientId) {
  throw new Error("No client ID provided");
}

const thirdweb = createThirdwebClient(secretKey ? { secretKey } : { clientId });

export default thirdweb;
