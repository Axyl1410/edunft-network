import pinata from "@/lib/pinata";

interface uploadFileProps {
  file: File;
  name?: string;
}

export async function uploadFile({ file, name }: uploadFileProps) {
  try {
    const upload = await pinata.upload.public
      .file(file)
      .name(name ?? file.name);
    return upload;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
