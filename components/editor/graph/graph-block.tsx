import "desmos";

import { InlineContentSchema, StyleSchema } from "@blocknote/core";
import { ReactCustomBlockRenderProps } from "@blocknote/react";
import { FC, useEffect, useRef } from "react";

import { GraphBlockConfig } from ".";

export const GraphBlock: FC<
  ReactCustomBlockRenderProps<
    GraphBlockConfig,
    InlineContentSchema,
    StyleSchema
  >
> = ({ block, editor, contentRef }) => {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphRef.current) return;

    const calculator = Desmos.GraphingCalculator(graphRef.current);

    if (block.props.state !== "{}")
      calculator.setState(JSON.parse(block.props.state));

    calculator.observeEvent("change", () => {
      editor.updateBlock(block.id, {
        props: {
          ...block.props,
          state: JSON.stringify(calculator.getState()),
        },
      });
    });

    graphRef.current.replaceChildren(graphRef.current.children[0]);
  }, [editor, block.id, block.props]);

  return <div ref={graphRef} className="w-full h-96"></div>;
};
