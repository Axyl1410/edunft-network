import { baseUrl } from "@/lib/client";
import pinataClient from "@/lib/pinata-client";
import axios from "axios";

// Upload file (public or private)
export async function uploadFile({
  file,
  name,
  type,
}: {
  file: File;
  name?: string;
  type: "public" | "private";
}) {
  try {
    const upload =
      type === "public"
        ? await pinataClient.upload.public.file(file).name(name ?? file.name)
        : await pinataClient.upload.private.file(file).name(name ?? file.name);
    // For private, return pinataId for later use
    return type === "private" ? { ...upload, pinataId: upload.id } : upload;
  } catch (error) {
    console.error(`Error uploading ${type} file:`, error);
    throw error;
  }
}

// Retrieve file (public or private)
export async function retrieveFile(hash: string, type: "public" | "private") {
  try {
    if (type === "public") {
      const data = await pinataClient.gateways.public.get(hash);
      const url = await pinataClient.gateways.public.convert(hash);
      return { data, url };
    } else {
      let data;
      try {
        data = await pinataClient.gateways.private.get(hash);
      } catch (error) {
        console.error("Error getting private file from Pinata:", error);
        throw error;
      }
      const url = await pinataClient.gateways.private.createAccessLink({
        cid: hash,
        expires: 30,
      });
      return { data, url };
    }
  } catch (error) {
    console.error(`Error retrieving ${type} file:`, error);
    throw error;
  }
}

// Delete file (public or private)
export async function deleteFilePinata(
  ids: string[],
  type: "public" | "private",
) {
  try {
    const unpin =
      type === "public"
        ? await pinataClient.files.public.delete(ids)
        : await pinataClient.files.private.delete(ids);
    return unpin;
  } catch (error) {
    console.error(`Error deleting ${type} file:`, error);
    throw error;
  }
}

// Get user files (API)
export async function getUserFiles(walletAddress: string) {
  try {
    const response = await axios.get(baseUrl + `/file/user/${walletAddress}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user files:", error);
    throw error;
  }
}

// Save file metadata (API)
export interface SaveFilePayload {
  walletAddress: string;
  hash: string;
  name: string;
  size: number;
  mimeType: string;
  network: "public" | "private";
  pinataId: string;
}

export async function saveFile(fileData: SaveFilePayload) {
  try {
    const response = await axios.post(baseUrl + "/file", fileData);
    return response.data;
  } catch (error) {
    console.error("Error saving file:", error);
    // Attempt to delete file from Pinata if API fails
    if (fileData.pinataId) {
      try {
        await deleteFilePinata([fileData.pinataId], fileData.network);
        console.log("File deleted from Pinata due to API error.");
      } catch (pinataError) {
        console.error(
          "Error deleting file from Pinata after API failure:",
          pinataError,
        );
      }
    }
    throw error;
  }
}

// Delete file in database (API)
export async function deleteFileInDatabase(hash: string) {
  try {
    const res = await axios.delete(baseUrl + "/file/" + hash);
    return res.data;
  } catch (error) {
    console.error("Error deleting file in database:", error);
    throw error;
  }
}
