import pinata from "@/lib/pinata";

export async function deleteFile(hash: string[]) {
  try {
    const unpin = await pinata.files.public.delete(hash);
    return unpin;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
