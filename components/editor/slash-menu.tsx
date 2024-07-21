"use client";

import "@blocknote/core/fonts/inter.css";

import { filterSuggestionItems } from "@blocknote/core";
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
} from "@blocknote/react";

import { insertMathBlock } from "./math";
import { CustomEditor } from "./schema";

interface CustomSlashMenuProps {
  editor: CustomEditor;
}

export const CustomSlashMenu = ({ editor }: CustomSlashMenuProps) => {
  return (
    <SuggestionMenuController
      triggerCharacter={"/"}
      getItems={async (query) =>
        filterSuggestionItems(
          [...getDefaultReactSlashMenuItems(editor), insertMathBlock(editor)],
          query
        )
      }
    />
  );
};
