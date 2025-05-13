import { baseUrl } from "@/lib/client";
import pinataClient from "@/lib/pinata-client";
import axios from "axios";

export async function deleteFile(hash: string[]) {
  try {
    const unpin = await pinataClient.files.public.delete(hash);
    return unpin;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export async function deletePrivateFile(hash: string[]) {
  try {
    const unpin = await pinataClient.files.private.delete(hash);
    return unpin;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export async function deleteFileInDatabase(hash: string) {
  try {
    const res = await axios.delete(baseUrl + "/file/" + hash);
    return res.data;
  } catch (error) {
    console.error("Error deleting file in database:", error);
    throw error;
  }
}
