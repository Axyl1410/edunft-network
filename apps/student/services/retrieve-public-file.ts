import pinataClient from "@/lib/pinata-client";

export async function retrievePublicFile(hash: string) {
  try {
    const data = await pinataClient.gateways.public.get(hash);
    const url = await pinataClient.gateways.public.convert(hash);

    return {
      data,
      url,
    };
  } catch (error) {
    console.error("Error retrieving file:", error);
    throw error;
  }
}
