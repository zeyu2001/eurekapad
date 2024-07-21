import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";

import { mathBlockSpec } from "@/components/editor/math";
import { transcriptionBlockSpec } from "@/components/editor/transcription";

export const customSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlockSpec,
    transcription: transcriptionBlockSpec,
  },
});

export type CustomEditor = typeof customSchema.BlockNoteEditor;
