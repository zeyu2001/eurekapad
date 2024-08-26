"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockBlobClient } from "@azure/storage-blob";
import { PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useAction, useConvexAuth } from "convex/react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { customSchema } from "@/components/editor/schema";
import { CustomSlashMenu } from "@/components/editor/slash-menu";
import { api } from "@/convex/_generated/api";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { isAuthenticated, isLoading } = useConvexAuth();

  const getUploadUrl = useAction(api.uploads.getUploadUrl);

  const handleUpload = async (file: File) => {
    if (!isAuthenticated || isLoading) {
      toast.error("You must be logged in to upload files.");
      return "";
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        "File size must be less than 10MB. Support for larger files coming soon!"
      );
      return "";
    }

    const uploadUrl = await getUploadUrl({});
    const blobServiceClient = new BlockBlobClient(uploadUrl);
    const response = await blobServiceClient.uploadBrowserData(file);

    if (response.errorCode) {
      toast.error("Failed to upload file.");
      return "";
    }

    return new URL(
      new URL(blobServiceClient.url).pathname,
      new URL(blobServiceClient.url).origin
    ).href;
  };

  const editor = useCreateBlockNote({
    schema: customSchema,
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        slashMenu={false}
        onChange={() => {
          onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
        }}
      >
        <CustomSlashMenu editor={editor} />
      </BlockNoteView>
    </div>
  );
};

export default Editor;
