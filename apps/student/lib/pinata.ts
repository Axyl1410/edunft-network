import { PinataSDK } from "pinata";
import { assertValue } from "./utils";

const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;

const pinataClient = new PinataSDK({
  pinataJwt: assertValue(jwt, "No Pinata JWT provided"),
  pinataGateway: assertValue(gateway, "No Pinata Gateway provided"),
});

export default pinataClient;
