"use node";

import { randomUUID } from "node:crypto";

import {
  BlobSASPermissions,
  BlobServiceClient,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

import { action } from "./_generated/server";

export const getUploadUrl = action({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    if (!accountName) throw Error("Azure Storage accountName not found");
    if (!accountKey) throw Error("Azure Storage accountKey not found");

    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey,
    );

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential,
    );

    const containerName = "uploads";

    const containerClient =
      await blobServiceClient.getContainerClient(containerName);

    const blobName = randomUUID();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Define the SAS token expiry time (1 hour from now)
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 1);

    // Generate SAS token
    const sasOptions = {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("c"), // 'c' for create permission
      expiresOn: expiryTime,
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential,
    ).toString();

    // Construct the full SAS URL
    const sasUrl = `${blockBlobClient.url}?${sasToken}`;

    return sasUrl;
  },
});
