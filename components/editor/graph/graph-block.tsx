import "desmos";

import { InlineContentSchema, StyleSchema } from "@blocknote/core";
import { ReactCustomBlockRenderProps } from "@blocknote/react";
import { FC, useEffect, useRef, useState } from "react";

import { GraphBlockConfig } from ".";

export const GraphBlock: FC<
  ReactCustomBlockRenderProps<
    GraphBlockConfig,
    InlineContentSchema,
    StyleSchema
  >
> = ({ block, editor, contentRef }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphState, setGraphState] = useState(block.props.state);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const updateEditor = () => {
    editor.updateBlock(block.id, {
      props: {
        ...block.props,
        state: JSON.stringify(graphState),
      },
    });
  };

  // can only initialize GraphingCalculator after graphRef is mounted
  useEffect(() => {
    if (!graphRef.current) return;

    const calculator = Desmos.GraphingCalculator(graphRef.current);

    if (block.props.state !== "{}")
      calculator.setState(JSON.parse(block.props.state));

    calculator.observeEvent("change", () => {
      setGraphState(calculator.getState());
    });

    // on subsequent callbacks, a duplicate graph is appended to the graphRef
    // this is a workaround to remove the duplicate graphs
    graphRef.current.replaceChildren(graphRef.current.children[0]);
  }, [editor, block.id, block.props]);

  return (
    <div
      ref={graphRef}
      // update when Desmos input loses focus,
      // otherwise interactive element will lose focus while user is still typing
      onBlur={updateEditor}
      className="w-full h-96"
    ></div>
  );
};
