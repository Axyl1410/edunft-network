import pinata from "@/lib/pinata";

export async function retrieveFile(hash: string) {
  try {
    const data = await pinata.gateways.public.get(hash);
    const url = await pinata.gateways.public.convert(hash);

    return {
      data,
      url,
    };
  } catch (error) {
    console.error("Error retrieving file:", error);
    throw error;
  }
}
