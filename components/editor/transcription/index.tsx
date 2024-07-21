import "@blocknote/mantine/style.css";

import {
  defaultProps,
  InlineContentSchema,
  StyleSchema,
} from "@blocknote/core";
import {
  createReactBlockSpec,
  ReactCustomBlockImplementation,
} from "@blocknote/react";
import { AiOutlineAudio } from "react-icons/ai";

import { CustomEditor } from "@/components/editor/schema";

import { TranscriptionBlock } from "./transcription-block";

export interface TranscriptionBlockConfig {
  type: "transcription";
  isFileBlock: false;
  readonly propSchema: typeof defaultProps;
  content: "inline";
}

const transcriptionBlockConfig: TranscriptionBlockConfig = {
  type: "transcription",
  isFileBlock: false,
  propSchema: {
    ...defaultProps,
  },
  content: "inline",
};

const transcriptionBlockImpl: ReactCustomBlockImplementation<
  TranscriptionBlockConfig,
  InlineContentSchema,
  StyleSchema
> = {
  render: TranscriptionBlock,
};

export const transcriptionBlockSpec = createReactBlockSpec<
  TranscriptionBlockConfig,
  InlineContentSchema,
  StyleSchema
>(transcriptionBlockConfig, transcriptionBlockImpl);

export const insertTranscriptionBlock = (editor: CustomEditor) => ({
  title: "Transcribe",
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    editor.insertBlocks(
      [
        {
          type: "transcription",
          content: "New transcription",
        },
      ],
      currentBlock
    );
  },
  icon: <AiOutlineAudio />,
  aliases: ["transcribe", "microphone", "audio", "voice"],
  group: "Advanced",
  subtext: "Transcribe audio from your microphone",
});
