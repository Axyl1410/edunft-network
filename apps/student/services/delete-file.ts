import pinataClient from "@/lib/pinata-client";

export async function deleteFile(hash: string[]) {
  try {
    const unpin = await pinataClient.files.public.delete(hash);
    return unpin;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
