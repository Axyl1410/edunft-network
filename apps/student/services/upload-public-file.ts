import pinataClient from "@/lib/pinata-client";

interface uploadFileProps {
  file: File;
  name?: string;
}

export async function uploadPublicFile({ file, name }: uploadFileProps) {
  try {
    const upload = await pinataClient.upload.public
      .file(file)
      .name(name ?? file.name);
    return upload;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
