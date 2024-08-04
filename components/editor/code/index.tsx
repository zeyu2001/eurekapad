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
import { langNames } from "@uiw/codemirror-extensions-langs";
import { Code } from "lucide-react";

import { CodeBlock } from "@/components/editor/code/code-block";
import { CustomEditor } from "@/components/editor/schema";

export interface CodeBlockConfig {
  type: "codeblock";
  isFileBlock: false;
  readonly propSchema: typeof defaultProps & {
    language: {
      default: string;
      values: string[];
    };
    code: {
      default: string;
    };
    stdout: {
      default: string;
    };
    stderr: {
      default: string;
    };
    images: {
      default: string;
    };
  };
  content: "none";
}

const codeBlockConfig: CodeBlockConfig = {
  type: "codeblock",
  isFileBlock: false,
  propSchema: {
    ...defaultProps,
    language: {
      default: "python",
      values: langNames,
    },
    code: {
      default: "",
    },
    stdout: {
      default: "",
    },
    stderr: {
      default: "",
    },
    images: {
      default: JSON.stringify([]),
    },
  },
  content: "none",
};

const codeBlockImpl: ReactCustomBlockImplementation<
  CodeBlockConfig,
  InlineContentSchema,
  StyleSchema
> = {
  render: CodeBlock,
  toExternalHTML: ({ block }) => {
    return (
      <pre>
        {/* @ts-ignore */}
        <code>{block?.props?.data}</code>
      </pre>
    );
  },
};

export const codeBlockSpec = createReactBlockSpec<
  CodeBlockConfig,
  InlineContentSchema,
  StyleSchema
>(codeBlockConfig, codeBlockImpl);

export const insertCodeBlock = (editor: CustomEditor) => ({
  title: "Code Block",
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    editor.insertBlocks(
      [
        {
          type: "codeblock",
          props: {
            language: "python",
          },
        },
      ],
      currentBlock
    );
  },
  icon: <Code size={16} />,
  aliases: ["code", "programming"],
  group: "Advanced",
  subtext: "Code block with syntax highlighting",
});
