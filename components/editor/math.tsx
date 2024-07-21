declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathMLElement>,
        MathMLElement
      >;
    }
  }
}

import "@blocknote/mantine/style.css";
import "mathlive";

import {
  defaultProps,
  InlineContentSchema,
  StyledText,
  StyleSchema,
} from "@blocknote/core";
import {
  createReactBlockSpec,
  ReactCustomBlockImplementation,
  ReactCustomBlockRenderProps,
} from "@blocknote/react";
import { FC, useState } from "react";
import { BiMath } from "react-icons/bi";

import { CustomEditor } from "./schema";

interface MathBlockConfig {
  type: "math";
  readonly propSchema: typeof defaultProps;
  content: "inline";
}

const mathBlockConfig: MathBlockConfig = {
  type: "math",
  propSchema: {
    ...defaultProps,
  },
  content: "inline",
};

const MathBlock: FC<
  ReactCustomBlockRenderProps<MathBlockConfig, InlineContentSchema, StyleSchema>
> = ({ block, editor, contentRef }) => {
  const content = block.content[0] as StyledText<StyleSchema>;
  const [latex, setLatex] = useState(content?.text || "");

  return (
    <math-field
      onInput={(evt) => {
        setLatex((evt.target as HTMLInputElement).value);
        editor.updateBlock(block, {
          content: (evt.target as HTMLInputElement).value,
        });
      }}
      style={{ backgroundColor: "transparent", width: "100%" }}
    >
      {latex}
    </math-field>
  );
};

const mathBlockImpl: ReactCustomBlockImplementation<
  MathBlockConfig,
  InlineContentSchema,
  StyleSchema
> = {
  render: MathBlock,
};

export const mathBlockSpec = createReactBlockSpec<
  MathBlockConfig,
  InlineContentSchema,
  StyleSchema
>(mathBlockConfig, mathBlockImpl);

export const insertMathBlock = (editor: CustomEditor) => ({
  title: "Block Equation",
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    editor.insertBlocks(
      [
        {
          type: "math",
          props: {
            textAlignment: "center",
          },
        },
      ],
      currentBlock
    );
  },
  icon: <BiMath />,
  aliases: ["math", "equation", "latex"],
  group: "Advanced",
  subtext: "Display a standalone equation",
});
