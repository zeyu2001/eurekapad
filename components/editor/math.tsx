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
  content: "none";
  readonly propSchema: typeof defaultProps & {
    latex: {
      default: string;
    };
  };
}

const mathBlockConfig: MathBlockConfig = {
  type: "math",
  propSchema: {
    ...defaultProps,
    latex: {
      default: "",
    },
  },
  content: "none",
};

const MathBlock: FC<
  ReactCustomBlockRenderProps<MathBlockConfig, InlineContentSchema, StyleSchema>
> = ({ block, editor, contentRef }) => {
  const [latex, setLatex] = useState(block.props.latex || "");

  return (
    <math-field
      onInput={(evt) => {
        setLatex((evt.target as HTMLInputElement).value);
        editor.updateBlock(block, {
          props: {
            latex: (evt.target as HTMLInputElement).value,
          },
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
  title: "Insert Equation",
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
  subtext: "Used to display an equation from LaTeX",
});
