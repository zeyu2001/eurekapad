"use client";

import { useAction, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCoverImage } from "@/hooks/use-cover-image";
import { upload } from "@/lib/client-uploads";

import { SingleImageDropzone } from "../single-age-dropzone";

export const CoverImageModal = () => {
  const params = useParams();
  const update = useMutation(api.documents.update);
  const coverImage = useCoverImage();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUploadUrl = useAction(api.uploads.getUploadUrl);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          "File size must be less than 10MB. Support for larger files coming soon!",
        );
        return;
      }

      const uploadUrl = await getUploadUrl({});
      const url = await upload(file, uploadUrl);

      if (!url) {
        toast.error("Failed to upload media.");
        return;
      }

      await update({
        id: params.documentId as Id<"documents">,
        coverImage: url.href,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
