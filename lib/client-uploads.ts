import { BlockBlobClient } from '@azure/storage-blob'

export const upload = async (file: File, uploadUrl: string): Promise<URL | null> => {
  const blobServiceClient = new BlockBlobClient(uploadUrl)
  const response = await blobServiceClient.uploadBrowserData(file)

  if (response.errorCode) {
    return null
  }

  return new URL(new URL(blobServiceClient.url).pathname, new URL(blobServiceClient.url).origin)
}
