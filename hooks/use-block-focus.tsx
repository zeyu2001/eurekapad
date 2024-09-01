import {
  BlockNoteEditor,
  BlockSchemaWithBlock,
  CustomBlockConfig,
  InlineContentSchema,
  StyleSchema,
} from "@blocknote/core";
import { RefObject, useEffect, useState } from "react";

const isFocusable = (item: HTMLElement) => {
  if (item.contentEditable === "true") {
    return true;
  }
  switch (item.tagName) {
    case "A":
      return !!item.href;
    case "INPUT":
      return item.type !== "hidden" && !item.disabled;
    case "SELECT":
    case "TEXTAREA":
    case "BUTTON":
      return !item.disabled;
    default:
      return false;
  }
};

const findFirstFocusableElement = (container: HTMLElement) => {
  return Array.from(container.getElementsByTagName("*")).find(isFocusable);
};

// Focuses the block when the text cursor is placed on it
// e.g. so that when inserting a new block, we can set the cursor position to the new block
export function useBlockFocus<
  T extends CustomBlockConfig,
  I extends InlineContentSchema,
  S extends StyleSchema,
>(
  ref: RefObject<HTMLElement>,
  editor: BlockNoteEditor<BlockSchemaWithBlock<T["type"], T>, I, S>,
  blockId: string,
) {
  const [firstFocusable, setFirstFocusable] = useState<HTMLElement | null>(
    null,
  );

  setTimeout(function poll() {
    if (ref.current && !firstFocusable) {
      const focusable = isFocusable(ref.current)
        ? ref.current
        : findFirstFocusableElement(ref.current);

      if (focusable) {
        setFirstFocusable(focusable);
        return;
      }
      setTimeout(poll, 500);
    }
  });

  useEffect(() => {
    if (firstFocusable && editor.getTextCursorPosition().block.id === blockId) {
      console.log(firstFocusable, firstFocusable.isContentEditable);
      firstFocusable.focus();
    }
  }, [firstFocusable, editor, blockId]);
}
