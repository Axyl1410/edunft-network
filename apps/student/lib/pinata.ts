import { PinataSDK } from "pinata";

const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;

const pinata = new PinataSDK({
  pinataJwt: jwt,
  pinataGateway: gateway,
});

export default pinata;
