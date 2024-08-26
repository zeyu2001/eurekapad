import { BlockBlobClient } from "@azure/storage-blob";
import { toast } from "sonner";

export const upload = async (
  file: File,
  getUploadUrl: Function
): Promise<URL | null> => {
  const uploadUrl = await getUploadUrl({});
  const blobServiceClient = new BlockBlobClient(uploadUrl);
  const response = await blobServiceClient.uploadBrowserData(file);

  if (response.errorCode) {
    toast.error("Failed to upload file.");
    return null;
  }

  return new URL(
    new URL(blobServiceClient.url).pathname,
    new URL(blobServiceClient.url).origin
  );
};
