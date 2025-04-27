import pinataClient from "@/lib/pinata-client";

export async function retrievePrivateFile(hash: string) {
  try {
    const data = await pinataClient.gateways.private.get(hash);
    const url = await pinataClient.gateways.private.createAccessLink({
      cid: hash,
      expires: 30,
    });

    return {
      data,
      url,
    };
  } catch (error) {
    console.error("Error retrieving file:", error);
    throw error;
  }
}
