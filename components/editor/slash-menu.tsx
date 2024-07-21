"use client";

import "@blocknote/core/fonts/inter.css";

import { filterSuggestionItems } from "@blocknote/core";
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
} from "@blocknote/react";

import { insertMathBlock } from "@/components/editor/math";
import { CustomEditor } from "@/components/editor/schema";
import { insertTranscriptionBlock } from "@/components/editor/transcription";

interface CustomSlashMenuProps {
  editor: CustomEditor;
}

const groupOrder = ["Headings", "Basic blocks", "Advanced", "Media", "Others"];

export const CustomSlashMenu = ({ editor }: CustomSlashMenuProps) => {
  return (
    <SuggestionMenuController
      triggerCharacter={"/"}
      getItems={async (query) =>
        filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(editor),
            insertMathBlock(editor),
            insertTranscriptionBlock(editor),
          ].sort((a, b) => {
            return (
              groupOrder.indexOf(a.group || "") -
                groupOrder.indexOf(b.group || "") ||
              a.title.localeCompare(b.title)
            );
          }),
          query
        )
      }
    />
  );
};
