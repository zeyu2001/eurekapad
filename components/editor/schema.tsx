import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";

import { mathBlockSpec } from "@/components/editor/math";

export const customSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlockSpec,
  },
});

export type CustomEditor = typeof customSchema.BlockNoteEditor;
