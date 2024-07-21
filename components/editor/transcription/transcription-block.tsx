import { InlineContentSchema, StyleSchema } from "@blocknote/core";
import { ReactCustomBlockRenderProps } from "@blocknote/react";
import { FC, useState } from "react";
import { AiOutlineAudio } from "react-icons/ai";
import { FaMagic } from "react-icons/fa";

import { type TranscriptionBlockConfig } from "@/components/editor/transcription";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const TranscriptionBlock: FC<
  ReactCustomBlockRenderProps<
    TranscriptionBlockConfig,
    InlineContentSchema,
    StyleSchema
  >
> = ({ block, editor, contentRef }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Alert>
        <div className="flex items-center justify-between">
          <Button
            className="mb-4"
            variant="outline"
            size="icon"
            onClick={() => setOpen((o) => !o)}
          >
            <AiOutlineAudio className="h-4 w-4" />
          </Button>
          <Button
            className="mb-4"
            variant="outline"
            onClick={() => setOpen((o) => !o)}
          >
            <FaMagic className="mr-2" /> Summary
          </Button>
        </div>
        <AlertDescription className="w-full max-h-52 overflow-y-scroll my-4">
          <div ref={contentRef}></div>
        </AlertDescription>
      </Alert>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:w-1/2 sm:max-w-full z-[99999]">
          <SheetHeader>
            <SheetTitle>Transcription</SheetTitle>
            <SheetDescription>
              Make changes to your profile here.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">this will be the summary</div>
        </SheetContent>
      </Sheet>
    </>
  );
};
