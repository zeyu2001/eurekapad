import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";

import { codeBlockSpec } from "@/components/editor/code";
import { mathBlockSpec } from "@/components/editor/math";
import { transcriptionBlockSpec } from "@/components/editor/transcription";

import { graphBlockSpec } from "./graph";

export const customSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlockSpec,
    codeblock: codeBlockSpec,
    transcription: transcriptionBlockSpec,
    graph: graphBlockSpec,
  },
});

export type CustomEditor = typeof customSchema.BlockNoteEditor;